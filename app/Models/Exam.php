<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;
use Quiz\lib\Tagging\TaggableTrait;
use Quiz\lib\Helpers\Str;

/**
 * Quiz\Models\Exam
 *
 * @property integer $id 
 * @property string $name 
 * @property string $slug 
 * @property string $description 
 * @property string $content 
 * @property integer $thoigian 
 * @property integer $cid 
 * @property integer $user_id 
 * @property integer $user_id_edited 
 * @property integer $begin 
 * @property boolean $is_file 
 * @property boolean $is_approve 
 * @property \Carbon\Carbon $created_at 
 * @property \Carbon\Carbon $updated_at 
 * @property integer $file_id 
 * @property integer $views 
 * @property-read \Illuminate\Database\Eloquent\Collection|\Quiz\Models\Question[] $question 
 * @property-read \Illuminate\Database\Eloquent\Collection|\Quiz\Models\History[] $history 
 * @property-read \Quiz\Models\User $user 
 * @property-read \Quiz\Models\Upload $file 
 * @property-read \Illuminate\Database\Eloquent\Collection|\$related[] $morphedByMany 
 * @property-read \Illuminate\Database\Eloquent\Collection|\Quiz\lib\Tagging\Tag[] $tagged 
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Exam whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Exam whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Exam whereSlug($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Exam whereDescription($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Exam whereContent($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Exam whereThoigian($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Exam whereCid($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Exam whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Exam whereUserIdEdited($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Exam whereBegin($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Exam whereIsFile($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Exam whereIsApprove($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Exam whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Exam whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Exam whereFileId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Exam whereViews($value)
 * @method static \Quiz\Models\Exam withAllTags($tagNames)
 * @method static \Quiz\Models\Exam withAnyTag($tagNames)
 */
class Exam extends Model {

    use TaggableTrait;

    protected $table = 'tests';

    protected $fillable = array('name','content','begin','thoigian','description','is_file','file_id');

    public static function boot()
    {
        Exam::saving(function($test)
        {
            if (empty($test->file_id))
            {
                // If this is test based on pdf file but have no file
                if($test->is_file) return false;
                $test->file_id = NULL;
            }
            $test->is_approve = true;
            $test->slug = Str::slug(trim($test->name));
        });
        Exam::saved(function()
        {
            \Cache::tags('tests')->flush();
        });
        Exam::creating(function ($test)
        {
            $test->user_id = \Auth::user()->id;
        });
        Exam::updating(function ($test)
        {
            $test->user_id_edited = \Auth::user()->id;
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
//    public function category()
//    {
//        return $this->belongsTo('Quiz\Models\Category','cid');
//    }
    public function user()
    {
        return $this->belongsTo('Quiz\Models\User');
    }

    public function file()
    {
        return $this->belongsTo('Quiz\Models\Upload','file_id');
    }

    public function date($date=null)
    {
        if(is_null($date))
            return $date = $this->created_at->diffForHumans();
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
        $key = 'totalQuestionTest'.$this->id;
        return \Cache::tags('tests','questions')->rememberForever($key, function()
        {
            return $this->question->count();
        });
    }

    /**
     * Return an array of question info
     */
    public function questionsList()
    {
        $key = 'questionsList'.$this->id;

        return \Cache::tags('tests')->rememberForever($key, function() {
            $questions = array();
            foreach ($this->question as $q)
            {
                $questions[] = [
                    'answer' => $q->right_answer,
                    'content' => $q->content
                ];
            }

            return $questions;
        });
    }
}
