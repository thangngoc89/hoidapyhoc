<?php namespace Quiz\Models;

use Zizaco\Entrust\EntrustRole;

class Role extends EntrustRole {

    protected $fillable = ['name'];

}