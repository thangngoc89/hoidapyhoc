<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Quiz\Models\uploadFile
 *
 * @property-read \Exam $user 
 * @property-read \Illuminate\Database\Eloquent\Collection|\$related[] $morphedByMany 
 */
class uploadFile extends Model {

    /**
     * Get user by username
     * @param $username
     * @return mixed
     */
    protected $table = 'files';
    public function user()
    {
        return $this->belongsTo('Exam','test_id');
    }
}
