<?php namespace Quiz\Models\Enstrust;

use Zizaco\Entrust\EntrustPermission;

class Permission extends EntrustPermission
{
    public $timestamps = false;

    protected $fillable = ['name','display_name'];
}