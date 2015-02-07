<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;
use Quiz\lib\Tagging\TaggableTrait;
use Quiz\lib\Helpers\LocalizationDateTrait;
use Quiz\lib\Helpers\Str;
use Illuminate\Database\Eloquent\SoftDeletes;

class Exam extends Model {

    use SoftDeletes;
    use TaggableTrait;
    use LocalizationDateTrait;

    protected $table = 'tests';

    protected $fillable = array('name','content','begin','thoigian','description','is_file','file_id','questions');

    public static function boot()
    {
        Exam::saving(function($exam)
        {
            if (empty($exam->file_id))
            {
                // If this is test based on pdf file but have no file
                if($exam->is_file) return false;
                $exam->file_id = NULL;
            }
            $exam->is_approve = true;
            $exam->slug = Str::slug(trim($exam->name));

        });
        Exam::saved(function($exam)
        {
            \Cache::tags('tests')->flush();
        });

        Exam::creating(function ($exam)
        {
            $exam->user_id = \Auth::user()->id;
        });
        Exam::updating(function ($exam)
        {
            $exam->user_id_edited = \Auth::user()->id;
        });
    }
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

    /*
     * Belongs to
     */

    // This relationship was keeped for migration
    public function category()
    {
        return $this->belongsTo('Quiz\Models\Category','cid');
    }
    public function user()
    {
        return $this->belongsTo('Quiz\Models\User');
    }

    public function file()
    {
        return $this->belongsTo('Quiz\Models\Upload','file_id');
    }

    public function date()
    {
        $date = \Date::parse($this->created_at);
        return $date->diffForHumans();
    }

    /*
     * Frontend Content
     */
    public function link($type = null)
    {
        if ($type == 'bangdiem')
            return '/quiz/bang-diem/'.$this->slug.'/'.$this->id;

        if ($type == 'edit')
            return '/quiz/'.$this->id.'/edit';

        return '/quiz/lam-bai/'.$this->slug.'/'.$this->id;
    }

    public function countHistory()
    {
        $key = 'historyCountTest' . $this->id;

        return \Cache::tags('tests', 'history')->rememberForever($key, function () {
            return $this->history->count();
        });
    }

    public function questionsCount()
    {
        return $this->questions_count;
    }

    /**
     * Return an array of question info
     */
    public function questionsList()
    {
        return $this->questions;
    }


    /**
     * Count and store questions count into database
     *
     */
    public function setQuestionsCountAttribute()
    {
        $this->attributes['questions_count'] = count($this->attributes['questions']);
    }
    /**
     * Return an array of json data from database
     *
     * @param $questions
     * @return mixed
     */
    public function getQuestionsAttribute($questions)
    {
        return json_decode($questions);
    }

    /**
     * Encode the questions array before pass into database
     * 
     * @param $questions
     */
    public function setQuestionsAttribute($questions)
    {
        $this->attributes['questions'] = json_encode($questions);
    }


}
