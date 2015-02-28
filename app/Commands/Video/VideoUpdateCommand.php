<?php namespace Quiz\Commands\Video;

use Quiz\Commands\Command;

use Illuminate\Contracts\Bus\SelfHandling;
use Quiz\Http\Requests\API\VideoUpdateRequest;
use Quiz\Models\Video;

class VideoUpdateCommand extends Command {
    /**
     * @var Video
     */
    public $video;
    /**
     * @var VideoUpdateRequest
     */
    public $request;

    /**
     * Create a new command instance.
     *
     * @param Video $video
     * @param VideoUpdateRequest $request
     * @return \Quiz\Commands\Video\VideoUpdateCommand
     */
	public function __construct(Video $video, VideoUpdateRequest $request)
	{
        $this->video = $video;
        $this->request = $request;
    }

}
