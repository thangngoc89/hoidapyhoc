<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model {

    protected $table = 'tests';

    public function question()
    {
        return $this->hasMany('Question');
    }
    public function history()
    {
        return $this->hasMany('History');
    }
    public function file()
    {
        return $this->hasMany('uploadFile')->orderBy('id', 'desc');
    }
    public function category()
    {
        return $this->belongsTo('Category','cid');
    }
    public function user()
    {
        return $this->belongsTo('User');
    }
    /*public function comments()
    {
        return $this->morphMany('Fbf\LaravelComments\Comment', 'commentable');
    }*/

    public function date($date=null)
    {
        if(is_null($date)) {
            $date = $this->created_at;
        }
        return Date::parse($date)->diffForHumans();
    }

    public function link()
    {
        return Url::to('/quiz').'/t/'.$this->slug;
    }
    public function countHistory()
    {
       return $this->history->count();
    }
}
