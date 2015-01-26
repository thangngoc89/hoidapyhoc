<?php namespace Quiz\Models;

use Quiz\Models\User;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model {

    protected $guarded = [];

    protected $table = 'users_profile';
    public function user()
    {
        return $this->belongsTo('user');
    }
    public function findOrCreateProfile($user, $userData,$provider)
    {
        $profile = Profile::where('provider',$this->convertProviderName($provider))
            ->where('identifier',$userData->id)
            ->where('email',$userData->email)
            ->first();

        if (is_null($profile))
        {
            $profile = new Profile([
                'user_id' => $user->id,
                'provider' => $this->convertProviderName($provider),
                'identifier' => $userData->id,
                'photoURL' => $userData->avatar,
                'profileURL' => $userData->user['link'],
                'gender' => $userData->user['gender'],
                'language'  => $userData->user['locale'],
                'email' => $userData->email,
                'displayName' => $userData->user['name'],
            ]);
            $profile->save();
        }

    }

    private function convertProviderName($provider)
    {
        switch($provider)
        {
            case 'facebook' : return 'Facebook'; break;
            case 'google' : return 'Google'; break;
        }
    }

}