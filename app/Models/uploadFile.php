<?php namespace Quiz\Models;

use Illuminate\Database\Eloquent\Model;

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
