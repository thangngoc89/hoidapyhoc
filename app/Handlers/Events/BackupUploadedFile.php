<?php namespace Quiz\Handlers\Events;

use Illuminate\Contracts\Filesystem\Factory as Filesystem;
use Quiz\Events\NewFileUploaded;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldBeQueued;
use Illuminate\Contracts\Filesystem\Cloud;
use Quiz\Models\Upload;

/**
 * Backup all uploaded file into S3 and Flickr
 *
 * Class BackupUploadedFile
 * @package Quiz\Handlers\Events
 */
class BackupUploadedFile implements ShouldBeQueued {
    /**
     * @var Upload
     */
    private $upload;
    /**
     * @var Filesystem
     */
    private $filesystem;

    /**
     * Create the event handler.
     *
     * @param Upload $upload
     * @param Filesystem $filesystem
     * @return \Quiz\Handlers\Events\BackupUploadedFile
     */
	public function __construct(Upload $upload, Filesystem $filesystem)
	{
        $this->upload = $upload;
        $this->filesystem = $filesystem;
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

        \Log::info('Upload file',$upload);
        #TODO: Unable to serialize Model here
        $upload = $this->upload->find($upload->id);

        $imageExtension = ['png','jpg','jpeg','gif'];

//        if ( !in_array($upload->extension,$imageExtension) )
//        {
//            return $this->toFlickr($upload);
//        }

        return $this->toS3($upload);
	}

    public function toFlickr(Upload $file)
    {

    }

    public function toS3(Upload $file)
    {
        if ($file->location === 's3')
            return;
        $content = $this->filesystem->disk('local')->get($file->filesystemPath);
        $backup = $this->filesystem->disk('s3')->put($file->filesystemPath, $content);

        \Log::info('Backup file',$backup);
    }

}
