<?php namespace Quiz\lib\API\User;

use League\Fractal\TransformerAbstract;
use Quiz\lib\API\Exam\ExamTransformers;
use Quiz\Models\Exam;
use Quiz\Models\User;

class UserTransformers extends TransformerAbstract
{
    protected $availableIncludes = [
        'profiles', 'exams', 'histories'
    ];

    public function transform(User $user)
    {
        return [
            'id'        => (int)$user->id,
            'name'      => (string) $user->name,
            'username'  => (string) $user->username,
            'email'     => (string) $user->email,
            'created_at'     => (string) $user->created_at,
            'updated_at'     => (string) $user->updated_at,
        ];
    }

    /**
     * Include Profiles
     *
     * @return \League\Fractal\Resource\Collection;
     */
    public function includeProfiles(User $user)
    {
        $profiles = $user->profiles;

        return $this->collection($profiles, new ProfileTransformers());
    }

    /**
     * Include Exams
     *
     * @return \League\Fractal\Resource\Collection;
     */
    public function includeExams(User $user)
    {
        $exams = $user->exams;

        return $this->collection($exams, new ExamTransformers());
    }

    /**
     * Include Histories
     *
     * @return \League\Fractal\Resource\Collection;
     */
    public function includeHistories(User $user)
    {
        $exams = $user->exams;

        return $this->collection($exams, new ExamTransformers());
    }
}