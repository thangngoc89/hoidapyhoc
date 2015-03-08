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

    /**
     * Return meta description SEO tag
     *
     * @return string
     */
    public function metaDescription()
    {
        $meta_desc = str_limit(strip_tags($this->content), 600);
        $meta_desc = str_replace('  ',' ',$meta_desc);
        $meta_desc = trim($meta_desc);

        if (!empty($this->description))
            return  $this->description;
        elseif (!$this->is_file && strlen($meta_desc) > 0)
            return $meta_desc;
        else
            return "Đề thi $this->name - Làm đề thi trắc nghiệm Y Học Online. Kho đề thi trắc nghiệm Y Học lớn nhất";
    }

}