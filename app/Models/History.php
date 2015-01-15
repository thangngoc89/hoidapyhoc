<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

class History extends Model {

    protected $table = 'history';
    protected $fillable = array('test_id','user_id');
    public function test()
    {
        return $this->belongsTo('Test');
    }
    public function user()
    {
        return $this->belongsTo('User','user_id');
    }
    public static function firsttime($user_id, $test_id )
    {
        $history  = History::where('test_id','=',$test_id)
            ->where('user_id','=',$user_id)
            ->count();
        if ($history == 0)
            return true;
        else return false;
    }
    public function rebake($test_id)
    {
      $history = $this->test($test_id);
      #dd($history);
      $khoa = array('f' => 'fds' );
      $questions = TestController::parseTest($test_id, true);
      $mainAnswer = '';
      foreach ($questions as $q)
      {
          $mainAnswer .= $q['answer'];
      }
      #User::chunk(20, function($history, $mainAnswer)
      #{
        foreach ($history as $h)
        {
          $answer = $h->anwser;
          echo similar_text($answer,$mainAnswer).'-----'.$h->score;
        }
      #});
    }
    public function date($date=null)
    {
        if(is_null($date)) {
            $date = $this->created_at;
        }

        return Date::parse($date)->diffForHumans();
    }
    public function answeredCount(){
        return strlen(str_replace('_','',$this->answer));
    }
}
