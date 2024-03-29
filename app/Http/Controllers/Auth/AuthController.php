<?php namespace Quiz\Http\Controllers\Auth;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\Registrar;
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

    /**
    * Create a new authentication controller instance.
    *
    * @param  \Illuminate\Contracts\Auth\Guard  $auth
    * @param  \Illuminate\Contracts\Auth\Registrar  $registrar
    * @return void
    */
	public function __construct(Guard $auth, Registrar $registrar)
	{
		$this->auth = $auth;
		$this->registrar = $registrar;

		$this->middleware('guest', ['except' => 'getLogout']);
	}


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
        return redirect()->intended(\Session::get('return'))
                ->with('success','Chào mừng bạn đến với Hỏi Đáp Y Học');
    }

    /**
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function getLogout()
    {
        $this->auth->logout();

        return redirect()->intended(\Input::get('return'))
                ->with('success','Hẹn gặp lại bạn lần sau');
    }

    /**
     * Get User Login Form
     * @return \Illuminate\View\View
     */
    public function getLogin()
    {
        return view('user.login');
    }


}
