<?php namespace Quiz\lib\Repositories\User;

use Quiz\lib\Repositories\AbstractEloquentRepository;
use Quiz\Models\User;
use Quiz\lib\Repositories\Profile\ProfileRepository as Profile;

class EloquentUserRepository extends AbstractEloquentRepository implements UserRepository {
    /**
     * @var User
     */
    protected $model;
    /**
     * @var Profile
     */
    private $profile;

    /**
     * @param User $model
     * @param Profile $profile
     */
    public function __construct(User $model, Profile $profile)
    {
        $this->model = $model;
        $this->profile = $profile;
    }

    /**
     * @param $data
     * @return User
     */
    public function createUserAndProfileFromSocialiteData($data)
    {
        $user = $this->model->fill([
            'email'    => $data->email,
            'avatar'   => $data->avatar,
            'name'     => $data->user['name'],
        ]);

        $user->confirmed = true;

        $user->save();

        $profile = $this->profile->createProfileFromSocialiteData($data, $user);

        if ( ! $profile )
            throw new \Exception('Can not create profile from socialite data');

        return $user;
    }

    /**
     * @param $data
     * @return User | bool
     */
    public function findUserFromSocialiteData($data)
    {
        if ( $data->email )
        {
            $user = $this->model->whereEmail($data->email)->first();

            #TODO: Add new profile if user is logging in with different provider
            if ($user)
                return $user;
        }

        $profile = $this->profile->findProfileFromSocialiteData($data);

        #TODO: Update new access_token
        if ( $profile && ! is_null($profile->user) )
            return $profile->user;

        return false;
    }
}