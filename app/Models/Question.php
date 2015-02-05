<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Quiz\Models\Question
 *
 * @property integer $id 
 * @property string $content 
 * @property string $right_answer 
 * @property integer $test_id 
 * @property-read \Exam $test 
 * @property-read \Illuminate\Database\Eloquent\Collection|\$related[] $morphedByMany 
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Question whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Question whereContent($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Question whereRightAnswer($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Question whereTestId($value)
 */
class Question extends Model {

    protected $table = 'questions';

    protected $fillable = array('right_answer','content');

    public $timestamps = false;

    public function test()
    {
        return $this->belongsTo('Exam');
    }

}
