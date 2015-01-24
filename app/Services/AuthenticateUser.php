<?php namespace Quiz\Services;

use Illuminate\Contracts\Auth\Guard;
use Laravel\Socialite\Contracts\Factory as Socialite;
use Quiz\lib\Repositories\User\UserRepository;


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


    /**
     *
     * @param $provider
     * @param $hasCode
     * @param AuthenticateUserListener $listener
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
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
     * Redirect user to provider to authorization
     * @param $driver
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    private function getAuthorizationFirst($driver)
    {
        return $this->socialite->driver($driver)->redirect();
    }

    /**
     * Get User Information from provider
     * @param $provider
     * @return \Laravel\Socialite\Contracts\User
     */
    private function getUser($provider)
    {
        return $this->socialite->driver($provider)->user();
    }
} 