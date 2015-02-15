<?php namespace Quiz\Handlers\Events;

use Quiz\Events\NewFileUploaded;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldBeQueued;

use Quiz\Models\Upload;

/**
 * Backup all uploaded file into S3
 *
 * Class UploadFileToS3
 * @package Quiz\Handlers\Events
 */
class BackupUploadedFile implements ShouldBeQueued  {

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
        $upload = $event->upload;
        $imageExtension = ['png','jpg','jpeg','gif'];
        if (!in_array($upload->extension,$imageExtension) )
            return $this->toFlickr($upload);

        return $this->toS3($upload);
	}

    public function toFlickr(Upload $file)
    {

    }

    public function toS3(Upload $file)
    {

    }

}
