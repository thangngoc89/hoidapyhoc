<?php namespace Quiz\Events\Video;

use Quiz\Events\Event;
use Quiz\Models\Video;

use Illuminate\Queue\SerializesModels;

class VideoUpdatedEvent extends Event {

	use SerializesModels;
    /**
     * @var Video
     */
    public $video;

    /**
     * Create a new event instance.
     *
     * @param Video $video
     * @return \Quiz\Events\Video\VideoUpdatedEvent
     */
	public function __construct(Video $video)
	{
        $this->video = $video;
    }

}
