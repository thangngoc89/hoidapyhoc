<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

class History extends Model {

    protected $table = 'history';
    protected $fillable = array('test_id','user_id');

    public static function boot()
    {
        parent::boot();

        History::saved(function($history){
            \Cache::tags('history','user'.$history->user_id)->flush();
            \Cache::tags('tests'.$history->test_id)->flush();
        });
    }
    public function test()
    {
        return $this->belongsTo('Quiz\Models\Exam');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo('Quiz\Models\User','user_id');
    }

    /**
     * @param $user_id
     * @param $test_id
     * @return bool
     */
    public function firstTime($user_id)
    {
        $history  = $this->where('test_id','=',$this->test_id)
            ->where('user_id','=',$user_id)
            ->count();
        if ($history == 0)
            return true;

        return false;
    }

    /**
     * @return mixed
     */
    public function date()
    {
        return $this->created_at->diffForHumans();
    }

    public function link()
    {
        return '/quiz/ket-qua/'.$this->test->slug.'/'.$this->id;
    }
    /**
     * @return int
     * Count answered question
     */
    public function answeredCount(){
        return strlen(str_replace('_','',$this->answer));
    }
}
