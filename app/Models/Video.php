<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Nicolaslopezj\Searchable\SearchableTrait;
use Quiz\lib\Helpers\LocalizationDateTrait;
use Quiz\lib\Tagging\TaggableTrait;
use Quiz\lib\Helpers\Str;

class Video extends Model {

    use TaggableTrait;
    use SoftDeletes;
    use LocalizationDateTrait;
    use SearchableTrait;

    protected $table = 'videos';
    protected $fillable = ['title','link','thumb','description','source'];

    protected $searchable = [
        'columns' => [
            'title' => 10,
//            'description' => 8,
        ]
    ];

    public static function boot()
    {
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




}
