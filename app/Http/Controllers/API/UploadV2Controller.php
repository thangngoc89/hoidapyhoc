<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use Quiz\Events\NewFileUploaded;
use Quiz\Http\Requests\uploadFileRequest;
use Quiz\lib\Helpers\Str;
use Quiz\lib\Repositories\Upload\UploadRepository as Upload;
use Image;

class UploadV2Controller extends APIController {
    /**
     * @var Upload
     */
    private $upload;
    /**
     * @var Guard
     */
    private $auth;

    /**
     * @param Upload $upload
     * @param Guard $auth
     */
    public function __construct (Upload $upload, Guard $auth)
    {

        $this->upload = $upload;
        $this->auth = $auth;
    }

    public function store(uploadFileRequest $request)
    {
        $file = $request->file('file');

        $info = [
            'orginal_filename' => $file->getClientOriginalName(),
            'extension' => $file->getClientOriginalExtension(),
            'mimetype'  => $file->getClientMimeType(),
            'size' => $file->getClientSize(),
        ];

        return $this->excute($file, $info);
    }

    public function excute($file, $info)
    {
        $upload = $this->upload->getFileInfo($info);

        // If file was not existed then upload it
        if (!$upload)
        {
            $destination = storage_path().'/uploads/';
            $file->move($destination, $this->createFileNameFromInfo($info));

            $upload = $this->saveFileData($info);


        }

        return $this->createResponse($upload);
    }

    /**
     * Process a paste in base64 encoded image
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     */
    public function paste(Request $request)
    {
        // array('image' => base64 string)

        $img = Image::make($request->image);

        $info = [
            'orginal_filename' => 'pastedImage'.time(),
            'extension' => Str::extensionFromMimeType($img->mime()),
            'mimetype'  => $img->mime(),
            'size'      => $img->filesize()
        ];

        $filename = $this->createFileNameFromInfo($info);

        $img->save(storage_path("uploads/{$filename}"));

        $upload = $this->saveFileData($info);

        event(new NewFileUploaded($upload));

        return $this->createResponse($upload);
    }

    /**
     * @param $info
     * @param $filename
     * @return mixed
     */
    private function saveFileData($info)
    {
        $upload = $this->upload->fill($info);
        $upload->user_id = $this->auth->user()->id;
        $upload->filename = $this->createFileNameFromInfo($info);
        $upload->location = config('filesystems.default');

        if (!$upload->save())
            throw new \Exception('Cannot save file info');

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
    public function createResponse($upload)
    {
        $response = [
            'id' => $upload->id,
            'filename' => $upload->filename,
            'link' => $upload->url()
        ];

        return response()->json($response, 200);
    }
} 