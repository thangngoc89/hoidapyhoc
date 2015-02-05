<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Quiz\Models\History
 *
 * @property integer $id 
 * @property integer $user_id 
 * @property integer $test_id 
 * @property string $answer 
 * @property integer $score 
 * @property boolean $is_first 
 * @property \Carbon\Carbon $created_at 
 * @property \Carbon\Carbon $updated_at 
 * @property boolean $isDone 
 * @property-read \Quiz\Models\Exam $test 
 * @property-read \Quiz\Models\User $user 
 * @property-read \Illuminate\Database\Eloquent\Collection|\$related[] $morphedByMany 
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\History whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\History whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\History whereTestId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\History whereAnswer($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\History whereScore($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\History whereIsFirst($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\History whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\History whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\History whereIsDone($value)
 */
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
