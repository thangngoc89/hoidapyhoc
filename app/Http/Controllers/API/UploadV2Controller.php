<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use Quiz\Commands\Upload\UploadNewFileCommand;
use Quiz\Exceptions\ApiException;
use Quiz\Http\Requests\uploadFileRequest;
use Quiz\lib\Helpers\Str;
use Quiz\lib\Repositories\Upload\UploadRepository as Upload;
use Quiz\lib\API\File\FileTransformers;
use Image;

class UploadV2Controller extends APIController {
    /**
     * @var Upload
     */
    private $upload;
    /**
     * @param Upload $upload
     * @param Guard $auth
     */
    public function __construct (Upload $upload, Guard $auth)
    {
        $this->upload = $upload;
    }

    public function show($upload)
    {
        return response()->api()->withItem($upload, new FileTransformers());
    }


    public function store(uploadFileRequest $request)
    {
        try
        {
            return $this->dispatch(new UploadNewFileCommand($request));

        } catch (\Exception $e) {

            return $this->throwError($e);
        }
    }

    /**
     * Process a paste in base64 encoded image
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     */
//    public function paste(Request $request)
//    {
//        // array('image' => base64 string)
//
//        $img = Image::make($request->image);
//
//        $info = [
//            'orginal_filename' => 'pastedImage'.time(),
//            'extension' => Str::extensionFromMimeType($img->mime()),
//            'mimetype'  => $img->mime(),
//            'size'      => $img->filesize()
//        ];
//
//        $filename = $this->createFileNameFromInfo($info);
//
//        $img->save(storage_path("app/uploads/{$filename}"));
//
//        $upload = $this->saveFileData($info);
//
//        return $this->createResponse($upload);
//    }

} 