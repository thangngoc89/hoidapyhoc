<?php namespace Quiz\lib\Repositories\User;

use Quiz\lib\Repositories\AbstractEloquentRepository;
use Quiz\Models\Profile;
use Quiz\Models\User;

class EloquentUserRepository extends AbstractEloquentRepository implements UserRepository {
    /**
     * @var Exam
     */
    protected $model;
    /**
     * @var Profile
     */
    private $profile;

    /**
     * @param Exam $model
     * @param Profile $profile
     */
    public function __construct(User $model, Profile $profile)
    {
        $this->model = $model;
        $this->profile = $profile;
    }

    public function findByEmailOrCreate($userData,$provider)
    {
        $user = $this->model->where('email',$userData->email)->first();
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