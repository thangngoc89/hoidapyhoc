<?php namespace Quiz\lib\Repositories\User;

use Quiz\lib\Repositories\AbstractEloquentRepository;
use Quiz\Models\Profile;
use Quiz\Models\User;

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

    public function findByEmailOrCreate($userData,$provider)
    {
        // TODO: Implement findByEmailOrCreate function
    }

    /**
     * @param $userData
     * @param $provider
     */
    public function createNewUserAndProfileFromData($userData, $provider)
    {
        $email = ($userData->email) ?: $this->createFakeEmail($userData, $provider);

        $user = $this->model->fill([
            'email'    => $email,
            'avatar'   => $userData->avatar,
            'name'     => $userData->user['name'],
        ]);

        $user->save();

        $profile = $this->profile->createProfile($user, $userData, $provider);

        return $profile;
    }

    #TODO: Refactor

    /**
     * Generate fake email address from user's external data
     *
     * @param $userData  || Data receive from socialite
     * @param $provider  || Provider name
     * @return string
     */
    private function createFakeEmail($userData, $provider)
    {
        $username = $this->providerAbbr($provider) . $userData->id;

        $email = $username . '@fake.hoidapyhoc.com';

        return $email;
    }

    /**
     * Make abbrevation from provider name
     * @param $provider
     * @return string
     */
    private function providerAbbr($provider)
    {
        $provider = strtolower($provider);

        switch($provider)
        {
            case 'facebook' : return 'fb';
            case 'google' : return 'gg';
        }
    }
}