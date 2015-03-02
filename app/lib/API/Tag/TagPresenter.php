<?php namespace Quiz\lib\API\Tag;

use Laracasts\Presenter\Presenter;

class TagPresenter extends Presenter {

    public function link()
    {
        return "/tag/" . $this->slug;
    }

}