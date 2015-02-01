<?php namespace Quiz\lib\Repositories\Tag;

use Quiz\lib\Repositories\AbstractEloquentRepository;
use Quiz\lib\Tagging\Tag;

class EloquentTagRepository extends AbstractEloquentRepository implements TagRepository {
    /**
     * @var Tag
     */
    protected $model;

    /**
     * @param Tag $model
     */
    public function __construct(Tag $model)
    {
        $this->model = $model;
    }


}