<?php namespace Quiz\lib\Tagging;

use Quiz\lib\Tagging\TaggingUtil;
use Illuminate\Database\Eloquent\Model as Eloquent;

/**
 * Copyright (C) 2014 Robert Conner
 */
class Tag extends Eloquent {

	protected $table = 'tagging_tags';
	public $timestamps = false;
	protected $softDelete = false;
	public $fillable = ['name','description'];
	
	public function __construct(array $attributes = array()) {
		parent::__construct($attributes);
	}

    public function exams() {
        return $this->morphedByMany('\Quiz\Model\Exam','taggable');
    }
	
	public function save(array $options = array()) {
		$validator = \Validator::make(
			array('name' => $this->name, 'description' => $this->description),
			array('name' => 'required|min:1')
		);
		
		if($validator->passes()) {
			$normalizer = \Config::get('tagging.normalizer');
			$normalizer = empty($normalizer) ? '\Quiz\lib\Tagging\TaggingUtil::slug' : $normalizer;
			
			$this->slug = call_user_func($normalizer, $this->name);
			parent::save($options);
		} else {
			throw new \Exception('Tag Name is required');
		}
	}
	
	/**
	 * Get suggested tags
	 */
	public function scopeSuggested($query) {
		return $query->where('suggest', true);
	}
	
	/**
	 * Name auto-mutator
	 */
	public function setNameAttribute($value) {
		$displayer = \Config::get('tagging.displayer');
		$displayer = empty($displayer) ? '\Illuminate\Support\Str::title' : $displayer;
		
		$this->attributes['name'] = call_user_func($displayer, $value);
	}
	
}
