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
            'avatar'   => $data->photoURL,
            'name'     => $data->displayName,
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
        if ( $data->email ) {

            $user = $this->model->whereEmail($data->email)->first();

            if ($user) {
                $this->createNewProfileIfNotExits($data, $user);
                return $user;
            }
        }

        $profile = $this->profile->findProfileFromSocialiteData($data);

        #TODO: Update new access_token
        if ($profile && ! is_null($profile->user)) {
            return $profile->user;
        }

        return false;
    }

    /**
     * Check for user's providers and create if not exits
     *
     * @param $data
     * @param $user
     */
    private function createNewProfileIfNotExits($data, User $user)
    {
        $profiles = $user->profiles;


        if (! is_null($profiles)) {

            $providers = $profiles->lists('provider');

            if ( in_array($data->provider, $providers) ) {
                return;
            } else {
                $this->profile->createProfileFromSocialiteData($data, $user);
            }
        } else {
            // If user have no profiles at all
            // create new profile for the given provider
            $this->profile->createProfileFromSocialiteData($data, $user);
        }

    }
}