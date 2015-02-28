<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use Quiz\Commands\Video\VideoUpdateCommand;
use Quiz\Http\Requests\API\VideoUpdateRequest;
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
            $exam = $this->dispatch(new ExamCreateCommand($request));

            return $this->show($exam);
    }

	/**
	 * Display the specified resource.
	 *
     * @param Video $video
	 * @return \Illuminate\Http\Response
	 */
	public function show($video)
	{
        return response()->api()->withItem($video, new VideoTransformers());
	}

    /**
     * Update the specified resource in storage.
     *
     * @param $video
     * @param VideoUpdateRequest $request
     * @return $this->show($video)
     */
    public function update($video, VideoUpdateRequest $request)
    {
        try {
            $video = $this->dispatch(new VideoUpdateCommand($video, $request));

            return $this->show($video);

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
	public function destroy($video)
	{
        if (! $video->delete())
            return response()->api()->errorInternalError('Error happpen during video delete');

        return response('',204);
	}

}
