<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;
use Quiz\Models\Exam;

/**
 * Quiz\Models\Category
 *
 * @property integer $id 
 * @property string $name 
 * @property string $description 
 * @property string $color 
 * @property string $slug 
 * @property \Carbon\Carbon $created_at 
 * @property \Carbon\Carbon $updated_at 
 * @property-read \Illuminate\Database\Eloquent\Collection|\Quiz\Models\Exam[] $test 
 * @property-read \Illuminate\Database\Eloquent\Collection|\$related[] $morphedByMany 
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Category whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Category whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Category whereDescription($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Category whereColor($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Category whereSlug($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Category whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Category whereUpdatedAt($value)
 */
class Category extends Model {

    protected $table = 'categories';
    /**
     * @var Exam
     */
    public static function boot()
    {
        Category::saved(function(){
            \Cache::tags('category')->flush();
        });
    }
    public function test()
    {
        return $this->hasMany('Quiz\Models\Exam','cid');
    }

    public function findBySlugOrFail($slug)
    {
        return $this->where('slug',$slug)->first();
    }

    public function link()
    {
        return '/quiz/c/'.$this->slug;
    }
}
