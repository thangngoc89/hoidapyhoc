<?php namespace Quiz\lib\Repositories\Profile;

use Quiz\lib\Repositories\AbstractEloquentRepository;
use Quiz\Models\Profile;
use Quiz\lib\Repositories\User\UserRepository as UserRepo;
use Quiz\Models\User;

class EloquentProfileRepository extends AbstractEloquentRepository implements ProfileRepository {
    /**
     * @var Profile
     */
    protected $model;

    /**
     * @param Profile $model
     */
    public function __construct(Profile $model)
    {
        $this->model = $model;
    }

    /**
     * Find profile by identifier and provider
     *
     * @param array $data
     * @return Profile
     */
    public function findProfileFromSocialiteData($data)
    {
        $profile = $this->model->whereIdentifier($data->id)
                                ->whereProvider($data->provider)
                                ->first();

        if ( ! $profile)
            return false;

        return $profile;
    }

    /**
     * Create new profile from socialite data
     *
     * @param $data
     * @param User $user
     * @return Profile
     */
    public function createProfileFromSocialiteData($data, User $user)
    {
        $profile = $this->model->create([
            'token'         => $data->token,
            'provider'      => $data->provider,
            'identifier'    => $data->id,
            'photoURL'      => ($data->avatar) ?: '',
            'profileURL'    => ($data->user['link']) ?: '',
            'gender'        => ($data->user['gender']) ?: '',
            'language'      => ($data->user['locale']) ?: '',
            'email'         => ($data->email) ?: '',
            'displayName'   => $data->user['name'],
        ]);

        $profile->user()->associate($user);

        $profile->save();

        return $profile;
    }
}