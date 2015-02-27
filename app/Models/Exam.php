<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;
use Quiz\lib\Tagging\TaggableTrait;
use Quiz\lib\Helpers\Str;
use Illuminate\Database\Eloquent\SoftDeletes;
use Nicolaslopezj\Searchable\SearchableTrait;
use Quiz\lib\Helpers\LocalizationDateTrait;
use Sofa\Revisionable\Laravel\RevisionableTrait;

class Exam extends Model {

    use SoftDeletes;
    use TaggableTrait;
    use LocalizationDateTrait;
    use SearchableTrait;
    use RevisionableTrait;

    protected $table = 'exams';

    protected $fillable = ['name','content','begin','thoigian','description','is_file','file_id','questions'];
    protected $guarded = ['views'];

    protected $searchable = [
        'columns' => [
            'name' => 10,
            'description' => 8,
            'content' => 5,
        ]
    ];

    protected $revisionable = [
        'name',
        'description',
        'content',
        'begin',
        'thoigian',
        'is_file',
        'file_id',
        'questions'
    ];

    protected $nonRevisionable = [
        'created_at',
        'updated_at',
        'deleted_at',
        'views'
    ];

    public static function boot()
    {
        parent::boot();

        static::saving(function($exam)
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
        static::saved(function($exam)
        {
            \Cache::tags('tests')->flush();
            \Cache::tags('exams')->flush();
            \Cache::tags('exam'.$exam->id)->flush();
        });
    }


    public function history()
    {
        return $this->hasMany('Quiz\Models\History','test_id');
    }

    public function file()
    {
        return $this->belongsTo('Quiz\Models\Upload','file_id');
    }

    public function user()
    {
        return $this->belongsTo('Quiz\Models\User');
    }


    // These relationships were kept for further migration
//    public function category()
//    {
//        return $this->belongsTo('Quiz\Models\Category','cid');
//    }
//    public function question()
//    {
//        return $this->hasMany('Quiz\Models\Question','test_id');
//    }



    /*
     * Frontend Content
     */
    public function link($type = null)
    {
//        if ($type == 'bangdiem')
//            return '/quiz/bang-diem/'.$this->slug.'/'.$this->id;

        if ($type == 'edit')
            return '/quiz/'.$this->id.'/edit';

        return '/quiz/lam-bai/'.$this->slug.'/'.$this->id;
    }

    public function countHistory()
    {
        $key = 'historyCountTest' . $this->id;

        return \Cache::tags('exam'.$this->id, 'history'.$this->id)->rememberForever($key, function () {
            return $this->history->count();
        });
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

    /**
     * Count questions
     *
     */
    public function getQuestionsCountAttribute()
    {
        return count($this->questions);
    }

}
