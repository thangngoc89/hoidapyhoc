<?php namespace Quiz\lib\API\Exam;

use League\Fractal\TransformerAbstract;
use Quiz\lib\API\Tag\TagTransformers;
use Quiz\lib\API\User\UserTransformers;
use Quiz\Models\Video;

class ExamTransformers extends TransformerAbstract {

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [
        'user','tagged'
    ];

    /**
     * List of resources include by default
     *
     * @var array
     */
    protected $defaultIncludes = [    ];

    public function transform(Video $video)
    {
        return [
            'id'            => (int) $video->id,
            'video'         => (string) $video->name,
            'user_id'       => (int) $video->user_id,
            'slug'          => (string) $video->slug,
            'description'   => (string) $video->description,
            'thumb'         => (string) $video->thumb,
            'duration'      => (string) $video->duration,
            'source'        => (string) $video->source,
            'views'         => (string) $video->views,
            'tags'          => $video->tagged->lists('id'),
            'created_at'    => (string) $video->created_at,
            'updated_at'    => (string) $video->updated_at
        ];
    }

    public function createResponse(Video $video)
    {
        return [
            'id'        => $video->id,
            'url'       => $video->link(),
            'editUrl'   => $video->link('edit'),
        ];
    }


    /**
     * Include User
     *
     * @return \League\Fractal\Resource\Collection;
     */
    public function includeUser(Video $video)
    {
        $user = $video->user;

        return $this->item($user, new UserTransformers());
    }

    /**
     * Include Tagged
     *
     * @return \League\Fractal\Resource\Collection;
     */
    public function includeTagged(Exam $video)
    {
        return $this->collection($video->tagged, new TagTransformers());
    }

} 