<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;
use Quiz\lib\Helpers\LocalizationDateTrait;

class History extends Model {

    protected $table = 'history';
    protected $fillable = ['test_id','user_id'];

    use LocalizationDateTrait;

    public static function boot()
    {
        parent::boot();

        static::saving(function($history)
        {
            /**
             * Append is first attribute
             */
            $oldHistory  = static::where('test_id','=',$history->test_id)
                ->where('user_id','=',$history->user_id)
                ->count();
            if ($oldHistory == 0)
                $history->is_first = true;
        });
        static::saved(function($history){
            \Cache::tags('history','user'.$history->user_id)->flush();
            \Cache::tags('exam'.$history->test_id,'history'.$history->test_id)->flush();
        });
    }
    public function exam()
    {
        return $this->belongsTo('Quiz\Models\Exam','test_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo('Quiz\Models\User','user_id');
    }


    public function link()
    {
        return '/quiz/ket-qua/'.$this->exam->slug.'/'.$this->id;
    }
    /**
     * @return int
     * Count answered question
     */
    public function answeredCount(){
        return strlen(str_replace('_','',$this->answer));
    }

    public function scopeDone($query)
    {
        return $query->where('isDone', 1);
    }

    public function scopeIsFirst($query)
    {
        return $query->where('is_first', 1);
    }
}
