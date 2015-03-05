<?php namespace Quiz\lib\Repositories\User;

use Quiz\lib\Repositories\BaseRepository;

interface UserRepository extends BaseRepository {

    public function createUserAndProfileFromSocialiteData($userData);

    public function findUserFromSocialiteData($socialiteData);
}