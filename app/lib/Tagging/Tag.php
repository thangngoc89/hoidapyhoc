<?php namespace Quiz\lib\Tagging;

use Nicolaslopezj\Searchable\SearchableTrait;
use Quiz\lib\Tagging\TaggingUtil;
use Illuminate\Database\Eloquent\Model as Eloquent;

class Tag extends Eloquent {

    use SearchableTrait;

	protected $table = 'tagging_tags';
	public $timestamps = false;
	protected $softDelete = false;
	public $fillable = ['name','description'];

    protected $searchable = [
        'columns' => [
            'name' => 10,
        ]
    ];

	public function __construct(array $attributes = array()) {
		parent::__construct($attributes);
	}

    public static function boot()
    {
        static::saving(function()
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
