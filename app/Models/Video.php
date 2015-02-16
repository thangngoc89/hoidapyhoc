<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Quiz\lib\Helpers\LocalizationDateTrait;
use Quiz\lib\Tagging\TaggableTrait;
use Quiz\lib\Helpers\Str;

class Video extends Model {

    use TaggableTrait;
    use SoftDeletes;
    use LocalizationDateTrait;

    protected $table = 'videos';
    protected $fillable = ['title','link','thumb','description','source'];

    public static function boot()
    {
        Video::saving(function ($video) {
            $video->slug = Str::slug(trim($video->title));
        });
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
