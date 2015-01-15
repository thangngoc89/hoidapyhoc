<?php

namespace spec\Quiz\Services;

use Illuminate\Contracts\Auth\Guard;
use Quiz\Models\User;
use Quiz\Services\AuthenticateUserListener;
use Quiz\lib\Repositories\UserRepository;
use Laravel\Socialite\Contracts\Factory;
use Laravel\Socialite\Two\ProviderInterface;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

class AuthenticateUserSpec extends ObjectBehavior
{
    const HAS_CODE = true;
    const HAS_NO_CODE = false;

    function let(UserRepository $users, Factory $socialite, Guard $auth)
    {
        $this->beConstructedWith($users, $socialite, $auth);
    }
    
    function it_authorizes_a_user(
        Factory $socialite,
        ProviderInterface $provider,
        AuthenticateUserListener $listener
    )
    {
        $provider->redirect()->shouldBeCalled();
        $socialite->driver('google')->willReturn($provider);
        $this->execute('google', self::HAS_NO_CODE, $listener);
    }
    function it_creates_a_user_if_authorization_is_granted(
        UserRepository $users,
        Factory $socialite,
        Guard $auth,

        User $user,
        AuthenticateUserListener $listener
    )
    {
        $socialite->driver('google')->willReturn(new ProviderStub);

        $users->findByEmailOrCreate(ProviderStub::$data,'google')->willReturn($user);

        $auth->login($user, self::HAS_CODE)->shouldBeCalled();

        $listener->userHasLoggedIn($user)->shouldBeCalled();

        $this->execute('google', self::HAS_CODE, $listener);

    }
}

class ProviderStub {
    public static $data = [
        'id' => 1,
        'nickname' => 'foo',
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'avatar' => 'foo.jpg'
    ];
    public function user()
    {
        return self::$data;
    }
}