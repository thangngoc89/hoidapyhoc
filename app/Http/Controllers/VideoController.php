<?php namespace Quiz\Http\Controllers;

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
     * @param Video $video
     */
    public function __construct(Video $video)
    {
        $this->video = $video;
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
