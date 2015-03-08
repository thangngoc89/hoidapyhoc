<?php namespace Quiz\Http\Controllers;

use Illuminate\Auth\Guard;
use Quiz\Http\Requests\AuthEditRequest;
use Quiz\lib\Repositories\User\UserRepository as User;
use Quiz\lib\Repositories\History\HistoryRepository as History;
use Quiz\lib\Repositories\Exam\ExamRepository as Exam;

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
     * @param User $user
     * @param History $history
     */
    public function __construct(Guard $auth, User $user)
    {
        $this->middleware('auth');
        $this->auth = $auth;
        $this->user = $user;
    }

    public function index()
    {
        $page = \Input::get('page');

        $users = \Cache::remember('usersIndex'.$page, 1440, function () {
            return $this->user->orderBy('created_at')->paginate(21);
        });

        return view('user.usersIndex', compact('users'));
    }
    public function getFinish()
    {
        $user = $this->auth->user();

        if (!is_null($user->username) && $user->email)
            return redirect('/@'.$user->username)->with('info','Bạn đã hoàn tất quá trình đăng kí');

        return view('user.authEdit',compact('user'));
    }

    /**
     * @param AuthEditRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function postFinish(AuthEditRequest $request)
    {
        $user = $this->user->find($this->auth->user()->id);

        $user->update($request->input());

        return redirect()->back();
    }

    /**
     * User's profile page
     *
     * @route @username
     * @param $username
     * @return \Illuminate\View\View
     */
    public function profile($user, History $history, Exam $exam)
    {
        $history = $history->recentDoneExam($user->id);

        #TODO: Move this to repository
        $postedExams = $user->exams()->with('tagged')->orderBy('updated_at','DESC')->take(5)->get();

        return view('user.profile',compact('user','history', 'postedExams'));
    }

}