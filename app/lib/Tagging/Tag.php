<?php namespace Quiz\lib\Tagging;

use Quiz\lib\Tagging\TaggingUtil;
use Illuminate\Database\Eloquent\Model as Eloquent;

/**
 * Copyright (C) 2014 Robert Conner
 *
 * @property integer $id 
 * @property string $slug 
 * @property string $name 
 * @property string $description 
 * @property boolean $suggest 
 * @property-read \Illuminate\Database\Eloquent\Collection|\$related[] $morphedByMany 
 * @method static \Illuminate\Database\Query\Builder|\Quiz\lib\Tagging\Tag whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\lib\Tagging\Tag whereSlug($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\lib\Tagging\Tag whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\lib\Tagging\Tag whereDescription($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\lib\Tagging\Tag whereSuggest($value)
 * @method static \Quiz\lib\Tagging\Tag suggested()
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

    public function tagged() {
        return $this->morphToMany('Quiz\lib\Tagging\Tag', 'taggable')->orWhereRaw('taggables.taggable_type IS NOT NULL');
    }

    public function exams() {
        return $this->morphedByMany('\Quiz\Models\Exam','taggable');
    }

    public function videos() {
        return $this->morphedByMany('\Quiz\Models\Video','taggable');
    }

    public function link()
    {
        return "/tag/".$this->slug;
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
            return $this->exams->count() + $this->videos->count();
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

}
