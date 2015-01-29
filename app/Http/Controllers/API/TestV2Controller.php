<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

use Illuminate\Support\Collection;
use Quiz\Http\Requests\Exam\TestSaveRequest;
use Quiz\Http\Requests\Exam\TestEditRequest;

use Quiz\lib\API\Transformers\ExamTransformers;
use Quiz\lib\Repositories\Exam\ExamRepository as Exam;
use Quiz\lib\Saver\TestCheckSaver;
use Quiz\Models\History;
use Quiz\Models\Question;

use Quiz\Services\PullExternalImage;
use Sorskod\Larasponse\Larasponse;

class TestV2Controller extends APIController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
    protected $test;


    protected $history;
    /**
     * @var Request
     */
    private $request;
    /**
     * @var Guard
     */
    private $auth;
    /**
     * @var Question
     */
    private $question;
    /**
     * @var Larasponse
     */
    private $fractal;

    /**
     * @param Exam $test
     * @param History $history
     * @param Request $request
     * @param Guard $auth
     * @param Question $question
     * @param Larasponse $fractal
     */
    public function __construct(Exam $test, History $history, Request $request, Guard $auth, Question $question, Larasponse $fractal)
    {
        $this->test         = $test;
        $this->question     = $question;
        $this->history      = $history;
        $this->request      = $request;
        $this->auth         = $auth;
        $this->fractal      = $fractal;

        $this->middleware('auth', ['except' => 'index']);
    }


	public function index()
	{
        $limit = $this->request->limit ?: 3;
        $test = $this->test->paginate($limit);

        return $this->fractal->paginatedCollection($test, new ExamTransformers());
    }

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store(TestSaveRequest $request, ExamTransformers $transformers)
	{
        try{
            $statusCode = 200;

            $test = $this->test->fill($request->all());

            if ($test->save())
                $test->tag($request->tags);

            $this->storeQuestion($test,$request->all());

            $response = $transformers->createResponse($test);

            return response()->json($response, $statusCode);
        }catch (\Exception $e){
            $statusCode = 500;
            return response()->json($e->getMessage(), $statusCode);
        }
    }

    public function storeQuestion($test, $input)
    {
         foreach ($input['questions'] as $q)
        {
            $question = new $this->question($q);
            $question->test_id = $test->id;
            $question->save();
        }
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
	 * @param  int  $id
	 * @return Response
	 */
    public function update($tests, TestEditRequest $request, ExamTransformers $transformers)
    {
        try{
            $statusCode = 200;
            $test = $tests->fill($request->all());

            if ($test->save())
                $test->tag($request->tags);

            $this->storeQuestion($test,$request->all());

            $response = $transformers->createResponse($test);

            return response()->json($response, $statusCode);
        }catch (\Exception $e){
            $statusCode = 500;
            return response()->json($e->getMessage(), $statusCode);
        }
    }

    public function pullPicture($id, PullExternalImage $puller)
    {
        $test = $this->test->find($id);
        return $puller->excute($test->content);
    }
    /**
     * Create a new history for test
     * @param $id
     * @return mixed
     */
    public function start($test)
    {
        try{
            $statusCode = 200;

            $history = $this->history->firstOrCreate([
                'user_id' => $this->auth->user()->id,
                'test_id' => $test->id,
                'isDone'  => 0
            ]);
            $history->is_first = $this->history->firstTime($history->user_id, $history->test_id);

            $response= [
                'user_history_id' => $history->id
            ];

            return response()->json($response, $statusCode);
        }catch (\Exception $e){
            $statusCode = 500;
            $error = $e->getMessage();
            return response()->json($error, $statusCode);
        }
    }
    /**
     * Check post and return right answer
     * @param $id
     */
    public function check ($test, ExamTransformers $transformer)
    {
        try{
            $statusCode = 200;

            $history = new TestCheckSaver($this->request->all(),$test);
            $history = $history->save();

            $response = $transformer->checkResponse($history);

            return response()->json($response, $statusCode);
        }catch (\Exception $e){
            $statusCode = 500;
            $error = $e->getMessage();
            return response()->json($error, $statusCode);
        }
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
