<?php namespace Quiz\Http\Controllers\API;

use Quiz\Commands\Exam\ExamCheckCommand;
use Quiz\Exceptions\ExamSaveException;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;

use Quiz\Http\Requests\Exam\ExamCreateRequest;
use Quiz\Commands\Exam\ExamCreateCommand;

use Quiz\Http\Requests\Exam\ExamUpdateRequest;
use Quiz\Commands\Exam\ExamUpdateCommand;

use Quiz\Http\Requests\Exam\ExamCheckRequest;

use Quiz\lib\Repositories\Exam\ExamRepository as Exam;
use Quiz\Models\History;

use Sorskod\Larasponse\Larasponse;
use Quiz\lib\API\Exam\ExamTransformers;

class ExamV2Controller extends APIController {

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
    public function __construct(History $history, Request $request, Guard $auth, Larasponse $fractal)
    {
        $this->history = $history;
        $this->request = $request;
        $this->auth = $auth;
        $this->fractal = $fractal;
        $this->middleware('auth', ['except' => 'index']);
    }


	public function index(Exam $exam)
	{
        $exam = $this->builder($this->request,$exam,['name']);

        $result = $this->fractal->paginatedCollection($exam, new ExamTransformers());

        return $result;
    }

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function store(ExamCreateRequest $request, ExamTransformers $transformer)
	{
        try {
            $exam = $this->dispatch(new ExamCreateCommand($request));

            $response = $transformer->createResponse($exam);

            return response()->json($response, 200);

        } catch (\Exception $e) {

            return $this->throwError($e);

        }
    }

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($exam)
	{
        return $this->fractal->item($exam, new ExamTransformers());
	}

    /**
     * Update the specified resource in storage.
     *
     * @param $test
     * @param ExamUpdateRequest $request
     * @param ExamTransformers $transformer
     * @internal param int $id
     * @return \Illuminate\Http\Response
     */
    public function update($exam, ExamUpdateRequest $request, ExamTransformers $transformer)
    {
        try {
            $exam = $this->dispatch(new ExamUpdateCommand($exam, $request));

            $response = $transformer->createResponse($exam);

            return response()->json($response, 200);

        } catch (\Exception $e) {

            return $this->throwError($e);

        }
    }

    /**
     * Create a new history for test
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function start($exam)
    {
        return $this->tryCatch(function() use ($exam) {

            $history = $this->history->firstOrCreate([
                'user_id' => $this->auth->user()->id,
                'test_id' => $exam->id,
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
     * @param ExamCheckRequest $request
     * @return \Illuminate\Http\Response
     */
    public function check ($exam, ExamTransformers $transformer, ExamCheckRequest $request)
    {
        try {
            $history = $this->dispatch(new ExamCheckCommand($exam, $request));

            $response = $transformer->checkResponse($history);

            return response()->json($response, 200);

        } catch (\Exception $e) {

            return $this->throwError($e);

        }
    }

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param int $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($test)
	{
//        $test->delete();
        return 'Deleted';
	}

}
