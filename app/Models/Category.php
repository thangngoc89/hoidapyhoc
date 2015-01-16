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
        return $this->hasMany('Quiz\Models\Exam','cid');
    }

    public function findBySlugOrFail($slug)
    {
        return $this->where('slug',$slug)->first();
    }

    public function link()
    {
        return '/quiz/c/'.$this->slug;
    }
}
