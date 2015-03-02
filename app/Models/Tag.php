<?php namespace Quiz\Models;

use Quiz\lib\Tagging\Tag as BaseTagModel;
use Quiz\lib\API\Tag\TagPresenter;
use Laracasts\Presenter\PresentableTrait;

class Tag extends BaseTagModel {

    use PresentableTrait;

    protected $presenter = TagPresenter::class;

}
