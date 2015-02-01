<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;

use Quiz\Events\Exam\ExamUpdateEvent;

use Quiz\Http\Requests\Exam\TestCheckRequest;
use Quiz\Http\Requests\Exam\ExamSaveRequest;
use Quiz\Http\Requests\Exam\ExamEditRequest;

use Quiz\lib\API\Exam\ExamEditSaver;
use Quiz\lib\API\Exam\ExamCheckSaver;
use Quiz\lib\API\Exam\ExamTransformers;
use Quiz\lib\API\Exam\ExamStoreSaver;

use Quiz\lib\Repositories\Exam\ExamRepository as Exam;
use Quiz\Models\History;

use Sorskod\Larasponse\Larasponse;

class TestV2Controller extends APIController {
    /**
     * @var Exam
     */
    private $test;
    /**
     * @var History
     */
    private $history;
    /**
     * @var Request
     */
    private $request;
    /**
     * @var Guard
     */
    private $auth;
    /**
     * @var Larasponse
     */
    private $fractal;


    /**
     * @param Exam $test
     * @param History $history
     * @param Request $request
     * @param Guard $auth
     * @param Larasponse $fractal
     */
    public function __construct(Exam $test, History $history, Request $request, Guard $auth, Larasponse $fractal)
    {
        $this->test = $test;
        $this->history = $history;
        $this->request = $request;
        $this->auth = $auth;
        $this->fractal = $fractal;
        $this->middleware('auth', ['except' => 'index']);
    }


	public function index()
	{
        $limit = $this->request->limit ?: 10;

        $test = $this->test->paginate($limit);

        $result = $this->fractal->paginatedCollection($test, new ExamTransformers());

        return $result;
    }

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store(ExamSaveRequest $request, ExamTransformers $transformer)
	{
        return $this->tryCatch(function() use ($transformer,$request)
        {
            $test = new ExamStoreSaver($request->all());
            $test = $test->save();
            $response = $transformer->createResponse($test);

            return $response;
        });
    }

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($test)
	{
        return $this->fractal->item($test, new ExamTransformers());
	}

    /**
     * Update the specified resource in storage.
     *
     * @param $test
     * @param ExamEditRequest $request
     * @param ExamTransformers $transformer
     * @internal param int $id
     * @return Response
     */
    public function update($test, ExamEditRequest $request, ExamTransformers $transformer)
    {
        return $this->tryCatch(function() use ($transformer,$request, $test)
        {
            $test = new ExamEditSaver($request->all(),$test);
            $test = $test->save();
            $response = $transformer->createResponse($test);

            event( new ExamUpdateEvent($test));

            return $response;
        });
    }

    /**
     * Create a new history for test
     * @param $id
     * @return mixed
     */
    public function start($test)
    {
        return $this->tryCatch(function() use ($test) {

            $history = $this->history->firstOrCreate([
                'user_id' => $this->auth->user()->id,
                'test_id' => $test->id,
                'isDone'  => 0
            ]);
            $history->is_first = $this->history->firstTime($history->user_id, $history->test_id);

            $response = [
                'user_history_id' => $history->id
            ];

            return $response;
        });
    }

    /**
     * Check post and return right answer
     * @param $test
     * @param ExamTransformers $transformer
     * @param TestCheckRequest $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function check ($test, ExamTransformers $transformer, TestCheckRequest $request)
    {
        return $this->tryCatch(function() use ($test,$transformer, $request)
        {
            $history = new ExamCheckSaver($request->all(),$test);
            $history = $history->save();
            $response = $transformer->checkResponse($history);

            return $response;
        });
    }

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($test)
	{
//        $test->delete();
        return 'Deleted';
	}

}
