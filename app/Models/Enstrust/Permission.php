<?php namespace Quiz\Models\Enstrust;

use Zizaco\Entrust\EntrustPermission;

class Permission extends EntrustPermission
{
    public $timestamps = false;

    public function role(){
        return $this->belongsTo('\Quiz\Models\Role');
    }
}