<?php namespace Quiz\lib\Repositories;

use Quiz\Models\User;
use Quiz\Models\Profile;

class UserRepository {
    /**
     * @var Profile
     */
    private $profile;

    /**
     * @param Profile $profile
     */
    public function __construct (Profile $profile)
    {
        $this->profile = $profile;
    }
    public function findByEmailOrCreate($userData,$provider)
    {
        $user = User::where('email',$userData->email)->first();
        if (is_null($user))
        {
            $user = new User ([
                'email'    => $userData->email,
                'avatar'   => $userData->avatar,
                'name'     => $userData->user['name'],
            ]);
            $user->save();
        }
        $this->profile->findOrCreateProfile($user, $userData, $provider);

        return $user;
    }


} 