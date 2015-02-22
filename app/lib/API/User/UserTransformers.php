<?php namespace Quiz\lib\API\User;

use League\Fractal\TransformerAbstract;
use Quiz\Models\User;

class UserTransformers extends TransformerAbstract
{
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
}