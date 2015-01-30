<?php namespace Quiz\lib\Composers;

use Quiz\lib\Tagging\Tag;
use Illuminate\Contracts\View\View;

class TagsListComposer {


    private $tag;
    /**
     * @param Tag $tag
     */
    public function __construct(Tag $tag)
    {
        $this->tag = $tag;
    }
    public function compose(View $view)
    {
        $tags = \Cache::tags('tests','tags')->rememberForever('tagsListComposer', function() {
            $tagList = $this->tag->has('exams')->with('exams')->take(10)->get()->sortByDesc(function($tag)
            {
                return $tag->exams->count();
            });

            return $tagList;
        });

        $view->with('tags', compact('tags'));
    }
} 