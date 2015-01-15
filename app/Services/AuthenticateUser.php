<?php namespace Quiz\Services;

use Illuminate\Contracts\Auth\Guard;
use Laravel\Socialite\Contracts\Factory as Socialite;
use Quiz\lib\Repositories\UserRepository;


/**
 * Class AuthenticateUser
 * @package Quiz
 */
class AuthenticateUser {
    /**
     * @var UserRepository
     */
    private $user;
    /**
     * @var Socialite
     */
    private $socialite;
    /**
     * @var Guard
     */
    private $auth;


    /**
     * @param UserRepository $user
     * @param Socialite $socialite
     * @param Guard $auth
     */
    public function __construct(UserRepository $user, Socialite $socialite, Guard $auth)
    {

        $this->user = $user;
        $this->socialite = $socialite;
        $this->auth = $auth;
    }


    public function execute($provider, $hasCode, AuthenticateUserListener $listener)
    {
        if ( ! $hasCode) return $this->getAuthorizationFirst($provider);

        // Get user data from Provider
        $userData = $this->getUser($provider);

        $user = $this->user->findByEmailOrCreate($userData, $provider);

        $this->auth->login($user, true);

        return $listener->userHasLoggedIn($user);
    }

    /**
     * @param $driver
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    private function getAuthorizationFirst($driver)
    {
        return $this->socialite->driver($driver)->redirect();
    }

    /**
     * @param $provider
     * @return \Laravel\Socialite\Contracts\User
     */
    private function getUser($provider)
    {
        return $this->socialite->driver($provider)->user();
    }
} 