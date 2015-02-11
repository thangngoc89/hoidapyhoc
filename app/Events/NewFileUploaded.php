<?php namespace Quiz\Events;

use Quiz\Events\Event;
use Illuminate\Queue\SerializesModels;
use Quiz\Models\Upload;

class NewFileUploaded extends Event {

	use SerializesModels;
    /**
     * @var Upload
     */
    public $upload;

    /**
     * Create a new event instance.
     *
     * @param Upload $upload
     * @return \Quiz\Events\NewFileUploaded
     */
	public function __construct(Upload $upload)
	{
        $this->upload = $upload;
    }

}
