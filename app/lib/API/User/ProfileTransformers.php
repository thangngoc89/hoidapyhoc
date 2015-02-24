<?php namespace Quiz\lib\API\User;

use League\Fractal\TransformerAbstract;
use Quiz\Models\Profile;

class ProfileTransformers extends TransformerAbstract
{

    public function transform(Profile $profile)
    {
        return [
            'id'            => (int)$profile->id,
            'externalId'    => (int)$profile->identifier,
            'name'          => (int)$profile->displayName,
            'email'         => (string) $profile->email,
            'provider'      => (string) $profile->provider,
            'gender'        => (string) $profile->gender,
            'profileURL'    => (string) $profile->profileURL,
            'photoURL'      => (string) $profile->photoURL,
        ];
    }
}