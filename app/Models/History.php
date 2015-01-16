<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

class History extends Model {

    protected $table = 'history';
    protected $fillable = array('test_id','user_id');
    public function test()
    {
        return $this->belongsTo('Quiz\Models\Exam');
    }
    public function user()
    {
        return $this->belongsTo('Quiz\Models\User','user_id');
    }
    public static function firstTime($user_id, $test_id )
    {
        $history  = History::where('test_id','=',$test_id)
            ->where('user_id','=',$user_id)
            ->count();
        if ($history == 0)
            return true;
        else return false;
    }

    public function date($date=null)
    {
        if(is_null($date)) {
            $date = $this->created_at;
        }

        return \Date::parse($date)->diffForHumans();
    }
    public function answeredCount(){
        return strlen(str_replace('_','',$this->answer));
    }
}
