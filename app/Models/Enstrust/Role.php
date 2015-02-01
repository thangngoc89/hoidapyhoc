<?php namespace Quiz\Models\Enstrust;

use Illuminate\Database\Eloquent\Model;
use Zizaco\Entrust\EntrustRole;

class Role extends EntrustRole {

    public function assigned_role() {
        return $this->hasMany('\Quiz\Models\Enstrust\AssignedRoles');
    }
    public function permission() {
        return $this->hasMany('\Quiz\Models\Enstrust\Permission');
    }

}