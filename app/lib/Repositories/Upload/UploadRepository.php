<?php namespace Quiz\lib\Repositories\Upload;

use Quiz\lib\Repositories\BaseRepository;

interface UploadRepository extends BaseRepository {

    public function getFileInfo($array);
}