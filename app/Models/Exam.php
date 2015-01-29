<?php namespace Quiz\Models;

use Quiz\lib\Tagging\TaggableTrait;
use Illuminate\Database\Eloquent\Model;
use Quiz\lib\Tagging\Tag;

class Exam extends Model {

    use TaggableTrait;

    protected $table = 'tests';

    protected $fillable = array('name','cid','content','begin','thoigian','description','is_file','file_id');

    public static function boot()
    {
        Exam::saved(function()
        {
            \Cache::tags('tests')->flush();
        });
        Exam::saving(function($test)
        {
            if (empty($test->file_id))
                $test->file_id = NULL;
            $test->slug = \Slugify::slugify(trim($test->name));
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

    public function date($date=null)
    {
        if(is_null($date)) {
            return $date = $this->created_at->diffForHumans();
        }
    }

    /*
     * Frontend Content
     */
    public function link($type = null)
    {
        switch($type)
        {
            case 'bangdiem':
                return '/quiz/bang-diem/'.$this->slug.'/'.$this->id;
            case 'edit':
                return '/quiz/'.$this->id.'/edit';
            default:
                return '/quiz/lam-bai/'.$this->slug.'/'.$this->id;
        }

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

    /**
     * Return an array of selected tags and all tag for Select2
     * @return mixed
     */
    public function selectedTags()
    {
        $key = 'selectedTags'.$this->id;

        return \Cache::tags('tests','tags')->rememberForever($key, function() {
            $tagList = Tag::all()->sortByDesc(function($tag)
            {
                return $tag->exams->count();
            });

            $selectedTags = $this->tagNames();
            $tags = array();

            foreach($tagList as $tag)
            {
                $tags[] = [
                    'id' => $tag->name,
                    'text' => $tag->name,
                    'selected' => (boolean)(in_array($tag->name,$selectedTags)),
                    'count' => (int) $tag->exams->count()
                ];
            }

            return $tags;
        });
    }
}
