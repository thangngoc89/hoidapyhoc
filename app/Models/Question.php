<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model {

    protected $table = 'questions';

    protected $fillable = array('right_answer','content');

    public $timestamps = false;

    public function test()
    {
        return $this->belongsTo('Exam');
    }

}
