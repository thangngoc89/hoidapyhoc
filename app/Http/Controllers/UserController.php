<?php namespace Quiz\Http\Controllers;

use Illuminate\Auth\Guard;
use Quiz\Http\Requests\UserRegisterFinishRequest;
use Quiz\lib\Repositories\User\UserRepository as User;
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
        if (!is_null($user->username))
            #return redirect('/@'.$user->username)->with('info','Bạn đã hoàn thành đăng kí');

        return view('user.finishRegistra',compact('user'));
    }

    /**
     * @param UserRegisterFinishRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function postFinish(UserRegisterFinishRequest $request)
    {
        $user = $this->user->find($this->auth->user()->id);
        $user->update($request->input());

        return redirect()->back();
    }
    public function profile($username)
    {
        $user = $this->user->getFirstBy('username', $username);

        $key = 'profileUserHistory'.$user->id;
        $history = \Cache::tags('history','user'.$user->id)->remember($key, 10, function() use ($user) {
            return $this->history->where('user_id',$user->id)
                ->with('test','test.category','test.question')
                ->orderBy('updated_at','DESC')
                ->take(5)
                ->get();
        });

        return view('user.profile',compact('user','history'));
    }

}