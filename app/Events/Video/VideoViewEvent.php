<?php namespace Quiz\Events\Video;

use Illuminate\Http\Request;
use Quiz\Events\Event;

use Illuminate\Queue\SerializesModels;
use Quiz\Models\Video;

class VideoViewEvent extends Event {

	use SerializesModels;
    /**
     * @var Video
     */
    public $video;
    /**
     * @var Request
     */
    public $request;

    /**
     * Create a new event instance.
     *
     * @param Video $video
     * @param Request $request
     * @return \Quiz\Events\Video\VideoViewEvent
     */
	public function __construct(Video $video, Request $request)
	{
        $this->video = $video;
        $this->request = $request;
    }

}
