<?php namespace Quiz\Commands\Upload;

use Quiz\Commands\Command;
use Quiz\Http\Requests\uploadFileRequest;

class UploadNewFileCommand extends Command {
    /**
     * @var uploadFileRequest
     */
    public $request;

    /**
     * Create a new command instance.
     *
     * @param uploadFileRequest $request
     * @return \Quiz\Commands\Upload\UploadNewFileCommand
     */
	public function __construct(uploadFileRequest $request)
	{
        $this->request = $request;
    }

}
