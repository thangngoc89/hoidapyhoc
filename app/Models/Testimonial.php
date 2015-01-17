<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model {

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