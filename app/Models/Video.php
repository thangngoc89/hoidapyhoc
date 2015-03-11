<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laracasts\Presenter\PresentableTrait;
use Nicolaslopezj\Searchable\SearchableTrait;
use Quiz\lib\Helpers\LocalizationDateTrait;
use Quiz\lib\Tagging\TaggableTrait;
use Quiz\lib\Helpers\Str;
use Quiz\lib\API\Video\VideoPresenter;

class Video extends Model {

    use SoftDeletes, TaggableTrait, LocalizationDateTrait, PresentableTrait;
    use SearchableTrait;

    protected $table = 'videos';
    protected $fillable = ['title','link','thumb','description','source','duration'];
    protected $guarded = ['views'];
    protected $dates = ['deleted_at'];
    protected $presenter = VideoPresenter::class;

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
     * Title auto-mutator
     */
    public function setTitleAttribute($value)
    {
        $displayer = config('tagging.displayer');
        $displayer = empty($displayer) ? '\Illuminate\Support\Str::title' : $displayer;

        $this->attributes['title'] = call_user_func($displayer, $value);
    }

    public function getVideoSourceAttribute()
    {
        #TODO: rename this from database (reverse for PHP Class)
        return $this->source;
    }

}
