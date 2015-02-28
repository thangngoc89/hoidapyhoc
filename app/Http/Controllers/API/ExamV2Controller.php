<?php namespace Quiz\Http\Controllers\API;

use Quiz\Commands\Exam\ExamCheckCommand;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;

use Quiz\Http\Requests\Exam\ExamCreateRequest;
use Quiz\Commands\Exam\ExamCreateCommand;

use Quiz\Http\Requests\Exam\ExamUpdateRequest;
use Quiz\Commands\Exam\ExamUpdateCommand;

use Quiz\Http\Requests\Exam\ExamCheckRequest;

use Quiz\lib\Repositories\Exam\ExamRepository as Exam;
use Quiz\lib\Repositories\History\HistoryRepository as History;

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
     * @param Exam $test
     * @param History $history
     * @param Request $request
     */
    public function __construct(History $history, Request $request)
    {
        $this->history = $history;
        $this->request = $request;
        $this->middleware('auth', ['except' => 'index']);
    }

	public function index(Exam $exam)
	{
        $exam = $this->builder($this->request,$exam, ['name'], ['tagged','file']);

        $result = response()->api()->withPaginator($exam, new ExamTransformers());

        return $result;
    }

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function store(ExamCreateRequest $request, ExamTransformers $transformer)
	{
        $exam = $this->dispatch(new ExamCreateCommand($request));

        #TODO: Move link generated into javascript
        $response = $transformer->createResponse($exam);

        return response()->json($response, 201);
    }

	/**
	 * Display the specified resource.
	 *
     * @param Exam $exam
	 * @return \Illuminate\Http\Response
	 */
	public function show($exam)
	{
        return response()->api()->withItem($exam, new ExamTransformers());
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
        $exam = $this->dispatch(new ExamUpdateCommand($exam, $request));

        #TODO: Move link generated into javascript
        $response = $transformer->createResponse($exam);

        return response()->json($response, 200);
    }

    /**
     * Create a new history for exam
     *
     * @param Exam $exam
     * @return \Illuminate\Http\Response
     */
    public function start($exam, Guard $auth)
    {
        $history = $this->history->firstOrCreate([
            'user_id' => $auth->user()->id,
            'test_id' => $exam->id,
            'isDone'  => 0
        ]);

        $response = [
            'user_history_id' => $history->id
        ];

        return response()->json($response, 201);
    }

    /**
     * Check post and return right answer
     * @param Exam $exam
     * @param ExamTransformers $transformer
     * @param ExamCheckRequest $request
     * @return \Illuminate\Http\Response
     */
    public function check ($exam, ExamCheckRequest $request)
    {
        $history = $this->dispatch(new ExamCheckCommand($exam, $request));

        return response()->json($history, 200);
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
