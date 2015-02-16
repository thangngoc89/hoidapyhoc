<?php namespace Quiz\Handlers\Events;

use Quiz\Events\NewFileUploaded;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldBeQueued;

use Quiz\Models\Upload;

/**
 * Backup all uploaded file into S3 and Flickr
 *
 * Class BackupUploadedFile
 * @package Quiz\Handlers\Events
 */
class BackupUploadedFile implements ShouldBeQueued  {
    /**
     * @var Upload
     */
    private $upload;

    /**
     * Create the event handler.
     *
     * @param Upload $upload
     * @return \Quiz\Handlers\Events\BackupUploadedFile
     */
	public function __construct(Upload $upload)
	{
        $this->upload = $upload;
    }

	/**
	 * Handle the event.
	 *
	 * @param NewFileUploaded $event
	 * @return $this
	 */
	public function handle(NewFileUploaded $event)
	{
        $upload = $event->upload;

        #TODO: Unable to serialize Model here
        $upload = $this->upload->find($upload->id);

        $imageExtension = ['png','jpg','jpeg','gif'];

        if (!in_array($upload->extension,$imageExtension) )
        {
            return $this->toFlickr($upload);
        }

        return $this->toS3($upload);
	}

    public function toFlickr(Upload $file)
    {

    }

    public function toS3(Upload $file)
    {

    }

}
