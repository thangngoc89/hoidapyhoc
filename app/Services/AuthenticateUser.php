<?php namespace Quiz\Services;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Collection;
use Laravel\Socialite\Contracts\Factory as Socialite;
use Quiz\lib\Auth\SocialiteDataNormalizer;
use Quiz\lib\Repositories\User\UserRepository;
use Quiz\Models\Profile;

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
     * @var SocialiteDataNormalizer
     */
    private $dataNormalizer;

    /**
     * @param UserRepository $user
     * @param Socialite $socialite
     * @param Guard $auth
     * @param SocialiteDataNormalizer $dataNormalizer
     */
    public function __construct(UserRepository $user, Socialite $socialite, Guard $auth, SocialiteDataNormalizer $dataNormalizer)
    {
        $this->user = $user;
        $this->socialite = $socialite;
        $this->auth = $auth;
        $this->dataNormalizer = $dataNormalizer;
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

        $userData = $this->getUserDataFromProvider($provider);

        $user = $this->findOrCreateUser($userData);

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
    private function getUserDataFromProvider($provider)
    {
        $data = $this->socialite->driver($provider)->user();

        // Push provider to data object
        $data->provider = strtolower($provider);

        return $this->dataNormalizer($data);
    }

    /**
     * @param $data
     * @return object
     */
    private function dataNormalizer($data)
    {
        return $this->dataNormalizer->normalizer($data);
    }

    /**
     * @param $userData
     * @return \Quiz\Models\User
     */
    private function findOrCreateUser($userData)
    {
        $user = $this->user->findUserFromSocialiteData($userData);

        if ( ! $user )
        {
            $user = $this->user->createUserAndProfileFromSocialiteData($userData);

            // Fire event: user.created
        }
        if ( ! $user instanceof \Quiz\Models\User )
            throw new \Exception("Can not find user instance");

        return $user;
    }

    public function testFacebookLogin()
    {
        $userData = [
            'token'     => 'CAAF0J5ZCwNXgBAKdE0xP9xZA026qKZCA6uBwSbKZCXUxftZBEHhJ9bq5NzLNwZAuK30rZBZCxZBsE5tF1fdGxLZA11AK6GnFHUH4Rdt7U2HeztrxousZApZAxTE88pSGfl8cJbHIiySSDq7TYsWddc8Uet6KVAlvQdfvcPz1x4oaQBhNRBK6rZBLmm308tt3MEceL1hCZBptMVdYRsTc9dRzlcbG6kmwnhbfZCe4AIZD',
            'id'        => '795824050479589',
            'nickname'  => null,
            'name'      => 'Nguyễn Khoa',
            'email'     => null,
            'avatar'    => 'https://graph.facebook.com/v2.2/795824050479589/picture?type=normal',
            'user'      => [
                "id"            => "795824050479589",
                "email"         => "contact@tienganhratde.com",
                "first_name"    => "Nguyễn",
                "gender"        => "male",
                "last_name"     => "Khoa",
                "link"          => "https://www.facebook.com/app_scoped_user_id/795824050479589/",
                "locale"        => "en_GB",
                "middle_name"   => "Đăng",
                "name"          => "Nguyễn Đăng Khoa",
                "timezone"      => 7,
                "updated_time"  => "2014-12-24T09:40:57+0000",
                "verified"      => true,
            ],
            'provider'  => 'facebook',
        ];
        $userData = (object) $userData;
        $userData =  $this->dataNormalizer($userData);

        return $this->findOrCreateUser($userData);
    }

}