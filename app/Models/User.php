<?php namespace Quiz\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Quiz\lib\Helpers\LocalizationDateTrait;
use Zizaco\Entrust\HasRole;

class User extends Model implements AuthenticatableContract, CanResetPasswordContract {

	use Authenticatable, CanResetPassword;
    use HasRole;
    use LocalizationDateTrait;

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'users';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = ['username', 'name', 'email', 'password','avatar'];

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = ['password', 'remember_token'];


    public static function boot()
    {
        parent::boot();

        User::saved(function($user){
            \Cache::tags('user'.$user->id)->flush();
        });
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function exams()
    {
        return $this->hasMany('Quiz\Models\Exam');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function history()
    {
        return $this->hasMany('Quiz\Models\History');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function profiles() {
        return $this->hasMany('Quiz\Models\Profile');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function upload()
    {
        return $this->hasMany('Quiz\Models\Upload');
    }
    /**
     * @return mixed
     */
    public function joined()
    {
        return $this->created_at->diffForHumans();
    }

    /**
     * @return mixed|string
     */
    public function getAvatar()
    {
        return ("/files/user/{$this->id}/avatar.jpg");
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        if (is_null($this->username))
            return $this->name;
        return $this->username;
    }

    /**
     * @return string
     */
    public function profileLink()
    {
        $url = '/@'.$this->username;
        return $url;
    }

}
