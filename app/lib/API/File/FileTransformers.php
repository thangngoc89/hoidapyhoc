<?php namespace Quiz\lib\API\File;

use League\Fractal\TransformerAbstract;
use Quiz\lib\API\User\UserTransformers;
use Quiz\Models\Upload;

class FileTransformers extends TransformerAbstract
{
    protected $availableIncludes = [
        'user'
    ];

    public function transform(Upload $upload)
    {
        return [
            'id'                => (int)$upload->id,
            'name'              => (string) $upload->filename,
            'original_filename' => (string) $upload->orginal_filename,
            'link'              => (string) $upload->url(),
            'mime'              => (string) $upload->mimetype,
            'size'              => (int) $upload->size,
            'extension'         => (string) $upload->extension,
            'created_at'        => (string) $upload->created_at,
        ];
    }

    /**
     * Include Profiles
     *
     * @return \League\Fractal\Resource\Collection;
     */
    public function includeUser(Upload $file)
    {
        return $this->item($file->user, new UserTransformers());
    }
}