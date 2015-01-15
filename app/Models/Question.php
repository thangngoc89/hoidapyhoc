<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model {

    protected $table = 'questions';

    public function test()
    {
        return $this->belongsTo('Exam');
    }
}
