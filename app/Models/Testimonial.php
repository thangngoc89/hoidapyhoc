<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model {

    public static function boot()
    {
        Testimonial::saved(function(){
            \Cache::tags('testimonial')->flush();
        });
    }
	// Add your validation rules here
	public static $rules = [
		'name'      => 'required',
		'link'      => 'url',
		'avatar'    => 'required|url',
		'content'   => 'required|min:10',
        'isHome'    => 'required|boolean'
	];
    public $timestamps = false;
	// Don't forget to fill this array
	protected $fillable = ['name','link','avatar','content','isHome'];

}