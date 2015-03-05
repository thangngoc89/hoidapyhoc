<?php namespace Quiz\Models;

use Quiz\Models\User;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model {

    protected $table = 'users_profile';
    protected $guarded = [];
    protected $fillable = ['provider','identifier','photoURL','profileURL','gender','language','email','displayName','token'];

    public function user()
    {
        return $this->belongsTo('Quiz\Models\User');
    }



}