<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Nicolaslopezj\Searchable\SearchableTrait;
use Quiz\lib\Helpers\LocalizationDateTrait;
use Quiz\lib\Tagging\TaggableTrait;
use Quiz\lib\Helpers\Str;

class Video extends Model {

    use SoftDeletes;
    use TaggableTrait;
    use LocalizationDateTrait;
    use SearchableTrait;

    protected $table = 'videos';
    protected $fillable = ['title','link','thumb','description','source','duration'];
    protected $guarded = ['views'];
    protected $dates = ['deleted_at'];

    protected $searchable = [
        'columns' => [
            'title' => 10,
//            'description' => 8,
        ]
    ];

    public static function boot()
    {
        parent::boot();

        static::saving(function ($video) {
            $video->slug = Str::slug(trim($video->title));
        });

        // TODO: Delete all tags in hard delete
    }

    public function user()
    {
        return $this->belongsTo('\Quiz\Models\User','user_id');
    }

    public function link()
    {
        return "/video/".$this->slug."/".$this->id;
    }

    /**
     * Return collection of tags related to the tagged model
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function tagged() {
        return $this->morphToMany('Quiz\Models\Tag', 'taggable');
    }

    /**
     * Name auto-mutator
     */
    public function setTitleAttribute($value) {
        $displayer = config('tagging.displayer');
        $displayer = empty($displayer) ? '\Illuminate\Support\Str::title' : $displayer;

        $this->attributes['title'] = call_user_func($displayer, $value);
    }

}
