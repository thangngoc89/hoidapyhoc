<?php namespace Quiz\Http\Controllers;

use Quiz\Events\Video\VideoViewEvent;
use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Quiz\Models\Video;

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

        $this->middleware( 'view_throttle', [ 'only' => ['show'] ] );
        $this->request = $request;
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
        $video->load(['tagged.videos' => function ($q) use ( &$relatedVideos, $video ) {
            $relatedVideos = $q->where('videos.id', '<>', $video->id)->limit(6)->get()->unique();
        }]);

        $count = $relatedVideos->count();
        if ($count < 6)
        {
            $currentIds = $relatedVideos->lists('id');
            $currentIds []= $video->id;

            $moreRelatedVideos = $this->video->whereRaw('RAND()')->whereNotIn('id',$currentIds)->take(6-$count)->get();
            $relatedVideos = $relatedVideos->merge($moreRelatedVideos);
        }

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
