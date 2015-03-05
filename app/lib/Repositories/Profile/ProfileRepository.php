<?php namespace Quiz\lib\Repositories\Profile;

use Quiz\lib\Repositories\BaseRepository;
use Quiz\Models\User;
interface ProfileRepository extends BaseRepository {

    public function findProfileFromSocialiteData($data);

    public function createProfileFromSocialiteData($data, User $user);

}