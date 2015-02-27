<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use Quiz\lib\Repositories\Video\VideoRepository as Video;
use Quiz\lib\API\Video\VideoTransformers;

class VideoV2Controller extends APIController {

    private $request;
    private $video;

    /**
     * @param Video $video
     * @param Request $request
     */
    public function __construct(Video $video, Request $request)
    {
        $this->video = $video;
        $this->request = $request;
        $this->middleware('auth', ['except' => 'index']);
    }


	public function index()
	{
        $videos = $this->builder($this->request, $this->video ,['title'], ['tagged','user']);

        $result = response()->api()->withPaginator($videos, new VideoTransformers());

        return $result;
    }

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function store()
	{
        try {
            $exam = $this->dispatch(new ExamCreateCommand($request));

            return $this->show($exam);

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
	public function show($video)
	{
        return response()->api()->withItem($video, new VideoTransformers());
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

            #TODO: Move link generated into javascript
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
        try {
            $history = $this->history->firstOrCreate([
                'user_id' => $auth->user()->id,
                'test_id' => $exam->id,
                'isDone'  => 0
            ]);

            $response = [
                'user_history_id' => $history->id
            ];

            return response()->json($response, 201);

        } catch (\Exception $e) {

            return $this->throwError($e);

        }
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
        try {
            $history = $this->dispatch(new ExamCheckCommand($exam, $request));

            return response()->json($history, 200);

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
