<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model {

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

    public function link()
    {
        return '/quiz/lam-bai/'.$this->slug.'/'.$this->id;
    }

    public function countHistory()
    {
       return $this->history->count();
    }
}
