<?php namespace Quiz\lib\Repositories\Upload;

use Quiz\lib\Repositories\AbstractEloquentRepository;
use Quiz\Models\Upload;

class EloquentUploadRepository extends AbstractEloquentRepository implements UploadRepository {
    /**
     * @var Upload
     */
    protected $model;


    /**
     * @param Upload $model
     */
    public function __construct(Upload $model)
    {
        $this->model = $model;
    }

    public function getFileInfo($array)
    {
        $file = $this->model->where('size',$array['size'])
                            ->where('orginal_filename',$array['orginal_filename'])
                            ->where('mimetype',$array['mimetype'])
                            ->where('extension',$array['extension'])
                            ->first();
        if (is_null($file))
            return false;
        if (! \File::exists(storage_path('uploads'.$file->filename)))
            return false;

        return $file;
    }


}