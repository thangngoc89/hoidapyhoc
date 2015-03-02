<?php namespace Quiz\lib\API\Exam;

use League\Fractal\TransformerAbstract;
use Quiz\lib\API\File\FileTransformers;
use Quiz\lib\API\Tag\TagTransformers;
use Quiz\lib\API\User\UserTransformers;
use Quiz\Models\Exam;
use Quiz\Models\History;

class ExamTransformers extends TransformerAbstract {

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [
        'user','file','tagged'
    ];

    public function transform(Exam $exam)
    {
        return [
            'id'            => (int) $exam->id,
            'user_id'       => (int) $exam->user_id,
            'name'          => (string) $exam->name,
            'slug'          => (string) $exam->slug,
            'description'   => (string) $exam->description,
            'content'       => (string) $exam->content,
            'thoigian'      => (int) $exam->thoigian,
            'begin'         => (int) $exam->begin,
            'tags'          => $exam->tagged->lists('name'),
            'tags_id'       => $exam->tagged->lists('id'),
            'approved'      => (boolean) $exam->is_approve,
            'file'          => $this->file($exam->file),
            'questions'     => $exam->questions,
            'created_at'    => (string) $exam->created_at,
            'updated_at'    => (string) $exam->updated_at
        ];
    }

    public function createResponse(Exam $exam)
    {
        return [
            'id'        => $exam->id,
            'url'       => $exam->link(),
            'editUrl'   => $exam->link('edit'),
        ];
    }

    private function file($upload)
    {
        if (is_null($upload))
            return null;

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
     * Include User
     *
     * @return \League\Fractal\Resource\Collection;
     */
    public function includeUser(Exam $exam)
    {
        $user = $exam->user;

        return $this->item($user, new UserTransformers());
    }

    /**
     * Include Tagged
     *
     * @return \League\Fractal\Resource\Collection;
     */
    public function includeTagged(Exam $exam)
    {
        return $this->collection($exam->tagged, new TagTransformers());
    }

} 