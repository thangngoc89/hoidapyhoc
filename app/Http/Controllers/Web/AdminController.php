<?php namespace Quiz\Http\Controllers\Web;

use Illuminate\Contracts\Auth\Guard;
use Quiz\Commands\GitDeploy;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Quiz\Models\User;

class AdminController extends Controller {

    public function __construct()
    {
        $this->middleware('admin',['except' => ['deploy']] );
    }
	/**
	 * Display ng-admin page
	 *
	 * @return Response
	 */
	public function index()
	{
        return view('site.admin');
	}

    /**
     * Let admin to impersonate a valid user account
     *
     * @param $user
     * @param Guard $auth
     * @return \Illuminate\Http\RedirectResponse
     */
    public function impersonate($user, Guard $auth)
    {
        if ( ! $user instanceof User )
            throw new \BadMethodCallException('You have to give a valid user model');

        $auth->logout();
        $auth->login($user, false);

        return redirect('/')->with('success','Impersonating ' . $user->username);
    }

}
