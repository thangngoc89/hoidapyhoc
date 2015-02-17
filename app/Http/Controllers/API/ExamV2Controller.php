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
use Quiz\lib\Repositories\History\HistoryRepository as History;

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
     * @var Larasponse
     */
    private $fractal;


    /**
     * @param Exam $test
     * @param History $history
     * @param Request $request
     * @param Larasponse $fractal
     */
    public function __construct(History $history, Request $request, Larasponse $fractal)
    {
        $this->history = $history;
        $this->request = $request;
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
     * @param Exam $exam
	 * @return \Illuminate\Http\Response
	 */
	public function show($exam)
	{
        return $this->fractal->item($exam, new ExamTransformers());
	}

    /**
     * Update the specified resource in storage.
     *
     * @param Exam $exam
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
     * Create a new history for exam
     *
     * @param Exam $exam
     * @return \Illuminate\Http\Response
     */
    public function start($exam, Guard $auth)
    {
        return $this->tryCatch(function() use ($exam, $auth) {

            $history = $this->history->firstOrCreate([
                'user_id' => $auth->user()->id,
                'test_id' => $exam->id,
                'isDone'  => 0
            ]);

            $response = [
                'user_history_id' => $history->id
            ];

            return $response;
        });
    }

    /**
     * Check post and return right answer
     * @param Exam $exam
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
     * Show exam's leader board
     *
     * @_GET['render'] boolean
     * @param $exam
     *
     * @return mixed
     */
    public function leaderBoard($exam, Request $request)
    {
        $render = ($request->has('render')) ? filter_var($request->render, FILTER_VALIDATE_BOOLEAN) : false;
        
        $top = $this->history->leaderBoardOfExamAndPaginated($exam->id);
        $top->appends( $request->except('page') );

        if ( !$render )
            #TODO: Return an paginated API of history collection using fractal
            return $top;

        return view('quiz.leaderboard',compact('top'));
    }

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param int $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($exam)
	{
//        $test->delete();
        return 'Deleted';
	}

}
