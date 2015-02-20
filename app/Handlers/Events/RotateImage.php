<?php namespace Quiz\Handlers\Events;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldBeQueued;
use Quiz\lib\Repositories\Upload\UploadRepository as Upload;
use Quiz\Events\NewFileUploaded;
use Image;

class RotateImage {
    /**
     * @var Upload
     */
    private $upload;

    /**
     * Create the event handler.
     *
     * @param Upload $upload
     * @return \Quiz\Handlers\Events\RotateImage
     */
	public function __construct(Upload $upload)
	{
        $this->upload = $upload;
    }

	/**
	 * Handle the event.
	 *
	 * @param  NewFileUploaded  $event
	 * @return void
	 */
	public function handle(NewFileUploaded $event)
	{
		$upload = $event->upload;

//        $upload = $this->upload->find($upload->id);

        // Don't touch gif file
        $imageExtension = ['png','jpg','jpeg'];

        if (!in_array($upload->extension,$imageExtension) )
            return;

        $image = Image::make($upload->path);

        $orientation = $image->exif('Orientation');

        if ( ! empty($orientation)) {

            switch ($orientation) {
                case 8:
                    $image->rotate(90);
                    break;
                case 3:
                    $image->rotate(180);
                    break;
                case 6:
                    $image->rotate(-90);
                    break;
            }
        }

        $image->save($upload->path);
	}

}
