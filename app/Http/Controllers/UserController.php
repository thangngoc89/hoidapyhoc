<?php namespace Quiz\Http\Controllers;

use Illuminate\Auth\Guard;
use Quiz\Http\Requests\UserRegisterFinishRequest;
use Quiz\Models\User;
use Quiz\Models\History;

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
     * @var History
     */
    private $history;

    /**
     * @param Guard $auth
     * @param User $user
     * @param History $history
     */
    public function __construct(Guard $auth, User $user, History $history)
    {
        $this->middleware('auth');
        $this->auth = $auth;
        $this->user = $user;
        $this->history = $history;
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
    public function profile($username)
    {
        $user = $this->user->findByUsernameOrFail($username);

        $history = $this->history->where('user_id',$user->id)
            ->with('test')
            ->orderBy('created_at','DESC')
            ->take(5)
            ->get();

        return view('user.profile',compact('user','history'));
    }

}