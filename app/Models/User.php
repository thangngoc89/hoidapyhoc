<?php namespace Quiz\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

/**
 * Class User
 * @package Quiz\Models
 */
class User extends Model implements AuthenticatableContract, CanResetPasswordContract {

	use Authenticatable, CanResetPassword;

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
//        return '';
        if ($this->avatar != null)
        {
            return $this->avatar;
        } else {
            return $this->getGravatar();
        }
    }

    /**
     * @return string
     */
    public function getGravatar()
    {
        $email = $this->email;
        $s = 50;
        $d = 'monsterid'; # [ 404 | mm | identicon | monsterid | wavatar ]
        $r = 'g';
        $img = false;
        $atts = array() ;
        $url = 'http://www.gravatar.com/avatar/';
        $url .= md5( strtolower( trim( $email ) ) );
        $url .= "?s=$s&d=$d&r=$r";
        if ( $img ) {
            $url = '<img src="' . $url . '"';
            foreach ( $atts as $key => $val )
                $url .= ' ' . $key . '="' . $val . '"';
            $url .= ' />';
        }
        return $url;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        if ($this->username != null)
            return $this->username;
        else
            return $this->name;
    }

    /**
     * @return string
     */
    public function profileLink()
    {
        $url = '/@'.$this->username;
        return $url;
    }

    /**
     * @param $username
     * @return mixed
     */
    public function findByUsernameOrFail($username)
    {
        if ($user = $this->where('username',$username)->first())
        {
            return $user;
        } else {
            abort(404);
        }
    }
}
