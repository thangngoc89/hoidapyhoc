<?php namespace Quiz\Handlers\Events;

use Quiz\Events\NewFileUploaded;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldBeQueued;

/**
 * Backup all uploaded file into S3
 *
 * Class UploadFileToS3
 * @package Quiz\Handlers\Events
 */
class UploadFileToS3  {

	/**
	 * Create the event handler.
	 *
	 * @return void
	 */
	public function __construct()
	{
		//
	}

	/**
	 * Handle the event.
	 *
	 * @param NewFileUploaded $event
	 * @return void
	 */
	public function handle(NewFileUploaded $event)
	{
		//
	}

}
