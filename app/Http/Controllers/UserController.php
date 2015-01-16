<?php namespace Quiz\Http\Controllers;

use Illuminate\Auth\Guard;
use Quiz\Http\Requests\UserRegisterFinishRequest;
use Quiz\Models\User;

class UserController extends Controller {
    /**
     * @var Guard
     */
    private $auth;
    /**
     * @var User
     */
    private $user;

    /**
     * @param Guard $auth
     */
    public function __construct(Guard $auth, User $user)
    {
        $this->middleware('auth');
        $this->auth = $auth;
        $this->user = $user;
    }

    public function getFinish()
    {
        $user = $this->auth->user();
        return view('user/finishRegistra',compact('user'));
    }

    /**
     * @param UserRegisterFinishRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function postFinish(UserRegisterFinishRequest $request)
    {
        $user = $this->user->find($this->auth->user()->id);
        $user->fill($request->input())->save();

        return redirect()->back();
    }
    public function profile($username, User $user)
    {
        $user = $this->user->findByUsernameOrFail($username);
//        dd($user);
        return view('user.profile',compact('user'));
    }

}