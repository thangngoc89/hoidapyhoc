<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;
use Quiz\Models\Exam;

class Category extends Model {

    protected $table = 'categories';
    /**
     * @var Exam
     */
    public static function boot()
    {
        Category::saved(function(){
            \Cache::tags('category')->flush();
        });
    }
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
