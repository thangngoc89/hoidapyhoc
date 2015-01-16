<?php namespace Quiz\Http\Controllers\Auth;

use Quiz\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use Quiz\Services\AuthenticateUser;
use Illuminate\Http\Request;
use Quiz\Services\AuthenticateUserListener;

class AuthController extends Controller implements AuthenticateUserListener{

	/*
	|--------------------------------------------------------------------------
	| Registration & Login Controller
	|--------------------------------------------------------------------------
	|
	| This controller handles the registration of new users, as well as the
	| authentication of existing users. By default, this controller uses
	| a simple trait to add these behaviors. Why don't you explore it?
	|
	*/

	use AuthenticatesAndRegistersUsers;

    public function external($provider, AuthenticateUser $authenticateUser, Request $request)
    {
        if ($request->has('return'))
        \Session::put($request->only('return'));
        // AuthenticateUser
        return $authenticateUser->execute($provider, $request->has('state'), $this);
    }

    /**
     * @param $user
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function userHasLoggedIn($user)
    {
        if (is_null($user->username))
        {
            return redirect('user/finish');
        }

        return redirect()->intended(\Session::get('return'));
    }

    /**
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function getLogout()
    {
        $this->auth->logout();
        return redirect()->intended(\Input::get('return'));
    }


}
