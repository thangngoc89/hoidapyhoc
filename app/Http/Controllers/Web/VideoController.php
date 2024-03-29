<?php namespace Quiz\Http\Controllers\Web;

use Quiz\Events\Video\VideoViewEvent;
use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Quiz\lib\Repositories\Video\VideoRepository as Video;

class VideoController extends Controller {
    /**
     * @var Video
     */
    private $video;
    /**
     * @var Request
     */
    private $request;

    /**
     * @param Video $video
     * @param Request $request
     */
    public function __construct(Video $video, Request $request)
    {
        $this->video = $video;
        $this->request = $request;
        $this->middleware( 'view_throttle', [ 'only' => ['show'] ] );
    }

	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index()
	{
		$videos = $this->video->latest()->paginate(15);
        return view('video.videoIndex',compact('videos'));
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return \Illuminate\View\View
	 */
	public function create()
	{
		//
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return \Illuminate\View\View
	 */
	public function show($slug, $video)
	{
        if ($slug != $video->slug)
            return redirect()->to($video->link());

        $relatedVideos = $this->video->getRelatedVideosByTags($video);

        event(new VideoViewEvent($video, $this->request));

        return view('video.videoShow',compact('video','relatedVideos'));
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return \Illuminate\View\View
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\View\View
	 */
	public function destroy($id)
	{
		//
	}

}
