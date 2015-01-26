<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Contracts\Auth\Guard;
use Quiz\Http\Requests\uploadFileRequest;
use Quiz\lib\Repositories\Upload\UploadRepository as Upload;

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
        $file = \Input::file('file');

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
            $filename =  md5($info['orginal_filename'].time()).'.'.$info['extension'];

            #TODO: Config S3 and test it
            $destination = public_path().'/uploads/';
            $file->move($destination, $filename);

            $upload = $this->upload->fill($info);
            $upload->user_id = $this->auth->user()->id;
            $upload->filename = $filename;
            $upload->location = config('filesystems.default');
            $upload->save();
        }
        //echo url('/uploads/'. $upload->filename);
        $response = [
            'id'    => $upload->id,
            'filename' => $upload->filenname,
            'url' => $upload->url()
        ];
        return response()->json($response,200);
    }
} 