<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model {

    protected $table = 'tests';

    /*
     * Has Many Relationship
     */
    public function question()
    {
        return $this->hasMany('Quiz\Models\Question','test_id');
    }
    public function history()
    {
        return $this->hasMany('Quiz\Models\History','test_id');
    }
    public function file()
    {
        return $this->hasMany('Quiz\Models\uploadFile','test_id')->orderBy('id', 'desc');
    }

    /*
     * Belongs to
     */
    public function category()
    {
        return $this->belongsTo('Quiz\Models\Category','cid');
    }
    public function user()
    {
        return $this->belongsTo('Quiz\Models\User');
    }

    public function date($date=null)
    {
        if(is_null($date)) {
            return $date = $this->created_at->diffForHumans();
        }
    }
    public function doneTest($user)
    {
        $tests = $this->select('tests.id')
            ->join('history', 'history.test_id', '=', 'tests.id')
            ->where('history.user_id', $user->id)
            ->groupBy('id')
            ->get();

        $tests = $this->whereIn('id',$tests->modelKeys());

        return $tests;
    }

    public function link()
    {
        return '/quiz/'.$this->slug.'/'.$this->id;
    }

    public function countHistory()
    {
       return $this->history->count();
    }
}
