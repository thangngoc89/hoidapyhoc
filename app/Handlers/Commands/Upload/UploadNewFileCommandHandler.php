<?php namespace Quiz\Handlers\Commands\Upload;

use Illuminate\Auth\Guard;
use Quiz\Commands\Upload\UploadNewFileCommand;

use Illuminate\Queue\InteractsWithQueue;
use Quiz\Exceptions\ApiException;
use Quiz\lib\Repositories\Upload\UploadRepository as Upload;

class UploadNewFileCommandHandler {
    /**
     * @var Upload
     */
    private $upload;
    /**
     * @var Guard
     */
    private $auth;

    /**
     * Create the command handler.
     *
     * @param Upload $upload
     * @param Guard $auth
     * @return \Quiz\Handlers\Commands\Upload\UploadNewFileCommandHandler
     */
	public function __construct(Upload $upload, Guard $auth)
	{
        $this->upload = $upload;
        $this->auth = $auth;
    }

	/**
	 * Handle the command.
	 *
	 * @param  UploadNewFileCommand  $command
	 */
	public function handle(UploadNewFileCommand $command)
	{
		$request = $command->request;

        $file = $request->file('file');

        $info = $this->getFileInfoFromRequestObject($file);

        #TODO: Add Database transaction into this to prevent data saved but file was not uploaded

        $upload = $this->upload->getFileInfo($info);

        if ( is_null($upload) )
        {
            $destination = storage_path('app/uploads/');
            $file->move($destination, $this->createFileNameFromInfo($info));

            $upload = $this->saveFileData($info);
        }

        return $this->createResponse($upload);

    }


    private function saveFileData($info)
    {
        $upload = $this->upload->fill($info);
        $upload->user_id = $this->auth->user()->id;
        $upload->filename = $this->createFileNameFromInfo($info);
        $upload->location = config('filesystems.default');

        if (!$upload->save())
            throw new ApiException('Cannot save file info');

        return $upload;
    }

    /**
     * @param $info
     * @return string
     */
    private function createFileNameFromInfo($info)
    {
        $filename = md5($info['orginal_filename'] . time()) . '.' . $info['extension'];
        return $filename;
    }

    /**
     * @param $upload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    private function createResponse($upload)
    {
        $response = [
            'id' => $upload->id,
            'filename' => $upload->filename,
            'original_filename' => $upload->orginal_filename,
            'link' => $upload->url()."?filename={$upload->orginal_filename}",
        ];

        return response()->json($response, 200);
    }

    /**
     * @param $file
     * @return array
     */
    private function getFileInfoFromRequestObject($file)
    {
        $info = [
            'orginal_filename' => $file->getClientOriginalName(),
            'extension' => $file->getClientOriginalExtension(),
            'mimetype' => $file->getClientMimeType(),
            'size' => $file->getClientSize(),
        ];
        return $info;
    }

}
