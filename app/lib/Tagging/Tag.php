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

    public static function boot()
    {
        Tag::saving(function()
        {
            \Cache::tags('tags')->flush();
        });
    }

    public function exams() {
        return $this->morphedByMany('\Quiz\Models\Exam','taggable');
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

    public function count() {
        return \Cache::tags('tags')->rememberForever('tagCount'.$this->id, function() {
            return $this->exams->count();
        });
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
		$displayer = config('tagging.displayer');
		$displayer = empty($displayer) ? '\Illuminate\Support\Str::title' : $displayer;
		
		$this->attributes['name'] = call_user_func($displayer, $value);
	}

    /**
     * Return an array of tag list and count for Select2
     * @return array
     */
    public function tagListForSelect2()
    {
        return \Cache::tags('tests','tags')->rememberForever('tagListForSelect2', function() {
            $tagList = $this->with('exams')->get()->sortByDesc(function($tag)
            {
                return $tag->exams->count();
            });

            $tags = array();
            foreach($tagList as $tag)
            {
                $tags[] = [
                    'id' => $tag->name,
                    'text' => $tag->name,
                    'count' => $tag->exams->count()
                ];
            }

            return $tags;
        });
    }
}
