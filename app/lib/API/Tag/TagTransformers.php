<?php namespace Quiz\lib\API\Tag;

use League\Fractal\TransformerAbstract;
use Quiz\lib\Tagging\Tag;

class TagTransformers extends TransformerAbstract {

    public function transform(Tag $tag)
    {
        return [
            'id'            => (int) $tag->id,
            'name'          => $tag->name,
            'count'         => $tag->count(),
            'suggest'       => (boolean) $tag->suggest,
            'created_at'    => $tag->created_at,
            'updated_at'    => $tag->updated_at,
        ];
    }
}
