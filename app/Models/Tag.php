<?php namespace Quiz\Models;

use Quiz\lib\Tagging\Tag as BaseTagModel;
use Quiz\lib\API\Tag\TagPresenter;
use Laracasts\Presenter\PresentableTrait;
use Nicolaslopezj\Searchable\SearchableTrait;

class Tag extends BaseTagModel {

    use PresentableTrait;
    use SearchableTrait;

    protected $presenter = TagPresenter::class;

    protected $searchable = [
        'columns' => [
            'name' => 10,
        ]
    ];

    public static function boot()
    {
        static::saving(function()
        {
            \Cache::tags('tags')->flush();
        });
    }

    public function exams() {
        return $this->morphedByMany('\Quiz\Models\Exam','taggable');
    }

    public function videos() {
        return $this->morphedByMany('\Quiz\Models\Video','taggable');
    }

    public function link()
    {
        return "/tag/".$this->slug;
    }

    public function count() {
        return \Cache::tags('tags')->rememberForever('tagCount'.$this->id, function() {
            return $this->exams->count() + $this->videos->count();
        });
    }
}
