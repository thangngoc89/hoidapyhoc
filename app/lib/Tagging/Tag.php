<?php namespace Quiz\lib\Tagging;

use Quiz\lib\Tagging\TaggingUtil;
use Illuminate\Database\Eloquent\Model as Eloquent;

class Tag extends Eloquent {

	protected $table = 'tagging_tags';
	public $timestamps = false;

	public $fillable = ['name','description'];

	public function __construct(array $attributes = array()) {
		parent::__construct($attributes);
	}

	public function save(array $options = array()) {
		$validator = \Validator::make(
			[
                'name' => $this->name,
            ],
			config('tagging.rules')
		);
		
		if($validator->passes()) {
			$normalizer = \Config::get('tagging.normalizer');
			$normalizer = empty($normalizer) ? '\Quiz\lib\Tagging\TaggingUtil::slug' : $normalizer;
			
			$this->slug = call_user_func($normalizer, $this->name);
			parent::save($options);
		}
        else {
			\Log::alert('Validation error for tag name ' . $this->name);
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
		$displayer = config('tagging.displayer');
		$displayer = empty($displayer) ? '\Illuminate\Support\Str::title' : $displayer;
		
		$this->attributes['name'] = call_user_func($displayer, $value);
	}

}
