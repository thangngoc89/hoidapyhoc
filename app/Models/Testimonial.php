<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Quiz\Models\Testimonial
 *
 * @property integer $id 
 * @property string $name 
 * @property string $link 
 * @property string $avatar 
 * @property string $content 
 * @property boolean $isHome 
 * @property-read \Illuminate\Database\Eloquent\Collection|\$related[] $morphedByMany 
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Testimonial whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Testimonial whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Testimonial whereLink($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Testimonial whereAvatar($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Testimonial whereContent($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Testimonial whereIsHome($value)
 * @method static \Quiz\Models\Testimonial home()
 */
class Testimonial extends Model {

    public static function boot()
    {
        Testimonial::saved(function(){
            \Cache::tags('testimonial')->flush();
        });
    }
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

    public function scopeHome($query)
    {
        return $query->where('isHome', true);
    }

}