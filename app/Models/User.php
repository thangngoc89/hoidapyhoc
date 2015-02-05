<?php namespace Quiz\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Zizaco\Entrust\HasRole;

/**
 * Class User
 *
 * @package Quiz\Models
 * @property integer $id 
 * @property string $username 
 * @property string $name 
 * @property string $avatar 
 * @property string $email 
 * @property string $password 
 * @property string $confirmation_code 
 * @property string $remember_token 
 * @property boolean $confirmed 
 * @property \Carbon\Carbon $created_at 
 * @property \Carbon\Carbon $updated_at 
 * @property-read \Illuminate\Database\Eloquent\Collection|\Quiz\Models\Exam[] $test 
 * @property-read \Illuminate\Database\Eloquent\Collection|\Quiz\Models\History[] $history 
 * @property-read \Illuminate\Database\Eloquent\Collection|\Quiz\Models\Profile[] $profiles 
 * @property-read \Illuminate\Database\Eloquent\Collection|\Quiz\Models\Upload[] $upload 
 * @property-read \Illuminate\Database\Eloquent\Collection|\$related[] $morphedByMany 
 * @property-read \Illuminate\Database\Eloquent\Collection|\config('entrust.role')[] $roles 
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\User whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\User whereUsername($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\User whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\User whereAvatar($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\User whereEmail($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\User wherePassword($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\User whereConfirmationCode($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\User whereRememberToken($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\User whereConfirmed($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\User whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\User whereUpdatedAt($value)
 */
class User extends Model implements AuthenticatableContract, CanResetPasswordContract {

	use Authenticatable, CanResetPassword;
    use HasRole;

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
    public function test()
    {
        return $this->hasMany('Quiz\Models\Exam','test_id');
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
