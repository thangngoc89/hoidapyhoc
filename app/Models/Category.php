<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;
use Quiz\Models\Exam;

class Category extends Model {

    protected $table = 'categories';
    /**
     * @var Exam
     */
    private $test;

    public function test()
    {
        return $this->hasMany('\Quiz\Models\Exam','cid');
    }

    public function link()
    {
        return URL::to('/quiz/c').'/'.$this->slug;
    }
}
