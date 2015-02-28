<?php namespace Quiz\Handlers\Commands\Video;

use Quiz\Commands\Video\VideoUpdateCommand;

use Illuminate\Queue\InteractsWithQueue;
use Quiz\Events\Video\VideoUpdatedEvent;

class VideoUpdateCommandHandler {

	/**
	 * Create the command handler.
	 *
	 * @return void
	 */
	public function __construct()
	{
		//
	}

	/**
	 * Handle the command.
	 *
	 * @param  VideoUpdateCommand  $command
	 */
	public function handle(VideoUpdateCommand $command)
	{
		$video = $command->video;
        $request = $command->request;

        $video->update($request->all());
        $video->save();
        $video->retag($request->tags);

        event( new VideoUpdatedEvent($video));

        return $video;
	}

}
