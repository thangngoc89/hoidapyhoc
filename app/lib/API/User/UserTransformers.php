<?php namespace Quiz\lib\API\User;

use League\Fractal\TransformerAbstract;
use Quiz\Models\User;

class UserTransformers extends TransformerAbstract
{
    public function transform(User $user)
    {
        return [
            'id'        => (int)$user->id,
            'name'      => $user->name,
            'username'  => $user->username,
        ];
    }
}