<?php namespace Quiz\lib\API\Exam;

use Laracasts\Presenter\Presenter;

class ExamPresenter extends Presenter {

    /**
     * Generate self link (and edit link as well)
     *
     * @param null $type
     * @return string
     */
    public function link($type = null)
    {
        if ($type == 'edit')
            return '/quiz/'.$this->id.'/edit';

        return '/quiz/lam-bai/'.$this->slug.'/'.$this->id;
    }

    public function createdDate()
    {
        return $this->created_at->diffForHumans();
    }

}