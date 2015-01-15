<?php namespace Quiz\Services;


interface AuthenticateUserListener {

    public function userHasLoggedIn($user);
} 