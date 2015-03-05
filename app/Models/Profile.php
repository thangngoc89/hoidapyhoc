<?php namespace Quiz\Models;

use Quiz\Models\User;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model {

    protected $table = 'users_profile';
    protected $guarded = [];
    protected $fillable = ['provider','identifier','photoURL','profileURL','gender','language','email','displayName'];

    public function user()
    {
        return $this->belongsTo('Quiz\Models\User');
    }

    /**
     * @param $user
     * @param $userData
     * @param $provider
     * @return static
     */
    public function findOrCreateProfile(User $user, $userData,$provider)
    {
        $profile = static::where('provider',$this->convertProviderName($provider))
            ->where('identifier',$userData->id)
            ->where('email',$userData->email)
            ->first();

        if (is_null($profile))
        {
            return $this->createProfile($user, $userData, $provider);
        }

        return $profile;
    }

    public function createProfile(User $user, $userData, $provider)
    {
        $profile = $this->create([
            'user_id' => $user->id,
            'provider' => $this->convertProviderName($provider),
            'identifier' => $userData->id,
            'photoURL' => ($userData->avatar) ?: '',
            'profileURL' => ($userData->user['link']) ?: '',
            'gender' => ($userData->user['gender']) ?: '',
            'language'  => ($userData->user['locale']) ?: '',
            'email' => ($userData->email) ?: '',
            'displayName' => $userData->user['name'],
        ]);

        return $profile;
    }

    private function convertProviderName($provider)
    {
        switch($provider)
        {
            case 'facebook' : return 'Facebook';
            case 'google' : return 'Google';
        }
    }

}