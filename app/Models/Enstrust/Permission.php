<?php namespace Quiz\Models;

use Zizaco\Entrust\EntrustPermission;

class Permission extends EntrustPermission
{
    public function role(){
        return $this->belongsTo('\Quiz\Models\Role');
    }
}