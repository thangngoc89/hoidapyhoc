<?php namespace Quiz\Services;

use Illuminate\Contracts\Auth\Authenticatable;
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
     * @param $provider
     * @param $hasCode
     * @param AuthenticateUserListener $listener
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function execute($provider, $hasCode, AuthenticateUserListener $listener)
    {
        if ( ! $hasCode) return $this->getAuthorizationFirst($provider);

        $code = \Request::get('code');

        if ($code == null)
            return redirect('/auth/login')
                    ->with('info','Không thể xác thực tài khoản.<br>
                        Vui lòng chấp nhận quyền truy cập của Hỏi Đáp Y Học ở Google/Facebook');

        $userData = $this->getUserDataFromProvider($provider);

        $user = $this->findOrCreateUser($userData);

        $this->auth->login($user, true);

        return $listener->userHasLoggedIn($user);
    }

    /**
     * Redirect user to provider to authorization
     *
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
     * @return Authenticatable
     * @throws \Exception
     */
    private function findOrCreateUser($userData)
    {
        $user = $this->user->findUserFromSocialiteData($userData);

        if (! $user) {
            $user = $this->user->createUserAndProfileFromSocialiteData($userData);

            //TODO: Fire event: user.created
        }

        if (! $user instanceof Authenticatable)
            throw new \Exception("Can not find user instance");

        return $user;
    }
}