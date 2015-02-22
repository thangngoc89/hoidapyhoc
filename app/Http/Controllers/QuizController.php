<?php namespace Quiz\Http\Controllers;

use Illuminate\Auth\Guard;
use Quiz\Events\Exam\ExamViewEvent;
use Quiz\lib\API\Exam\ExamTransformers;
use Quiz\lib\Repositories\Exam\ExamRepository as Exam;
use Quiz\lib\Repositories\History\HistoryRepository as History;

use Illuminate\Http\Request;

use Quiz\Services\QuizHomePage;

class QuizController extends Controller {

    /**
     * @var Exam
     */
    private $exam;
    /**
     * @var History
     */
    private $history;
    /**
     * @var Guard
     */
    private $auth;

    /**
     * @var Request
     */
    private $request;

    /**
     * @param Exam $exam
     * @param History $history
     * @param Guard $auth
     * @param Request $request
     */
    public function __construct(Exam $exam, History $history, Guard $auth, Request $request)
    {
        $this->exam     = $exam;
        $this->history  = $history;
        $this->auth     = $auth;
        $this->request = $request;
        $this->middleware('auth', ['only' => ['create','edit']]);
        $this->middleware('view_throttle', ['except' => ['create','edit','index']]);
    }


    /**
     * @param QuizHomePage $view
     * @return \Illuminate\View\View
     */
    public function index(QuizHomePage $view)
	{
        return $view->execute($this->request);
	}


    /**
     * Display a quiz test page
     * @param null $slug
     * @param $t
     * @return \Illuminate\View\View
     */
    public function show($slug = null, $t)
	{
        $t->load('tagged');

        if ($t->slug != $slug)
            return redirect()->to($t->link());

        $haveHistory = false;

        if ($this->auth->check())
            $haveHistory = $this->history->findUserHistoryOfExam($t->id, $this->auth->user()->id);

        event(new ExamViewEvent($t, $this->request));
        // Define for blade template
        $viewHistory = false;

        return view('quiz.do',compact('t','haveHistory','viewHistory'));
	}

    /**
     * Show History after done test
     *
     * @param $slug
     * @param $id
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\View\View
     */
    public function showHistory($slug,$id)
    {
        $history = $this->history->getFirstBy('id',$id,['user']);

        $t = $history->exam;

        if ($t->slug != $slug)
            return redirect()->to($history->link());

        // Define for blade template
        $viewHistory = true;

        event(new ExamViewEvent($t, $this->request));

        return view('quiz.history',compact('t','history','viewHistory'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {
        $name = "Tạo đề thi mới";
        $data = [
            'type' => 'create',
        ];

        $data = json_encode($data);

        return view('quiz.create',compact('data','name'));
    }

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return \Illuminate\View\View
	 */
	public function edit($exam, ExamTransformers $transformer)
	{
        $name = 'Sửa đề thi';

        $data = [
            'type' => 'edit',
            'test' => $transformer->transform($exam),
        ];

        $data = json_encode($data);

        return view('quiz.create',compact('data','name'));
	}

}
