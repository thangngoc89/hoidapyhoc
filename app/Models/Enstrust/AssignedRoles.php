<?php namespace Quiz\Models\Enstrust;

use Illuminate\Database\Eloquent\Model;

class AssignedRoles extends Model {

    protected $guarded = array();


    public static $rules = array();

    public function role() {
        return $this->belongsTo('\Quiz\Models\Enstrust\Role');
    }

}