<?php namespace Quiz\Http\Controllers;

use Illuminate\Auth\Guard;
use Quiz\Events\ViewTestEvent;
use Quiz\lib\API\Exam\ExamTransformers;
use Quiz\lib\Tagging\Tag;
use Quiz\Models\History;
use Quiz\lib\Repositories\Exam\ExamRepository as Exam;
use Illuminate\Http\Request;

use Quiz\Services\QuizHomePage;

class QuizController extends Controller {

    /**
     * @var Exam
     */
    private $test;
    /**
     * @var History
     */
    private $history;
    /**
     * @var Guard
     */
    private $auth;
    /**
     * @var Tag
     */
    private $tag;
    /**
     * @var Request
     */
    private $request;

    /**
     * @param Tag $tag
     * @param Exam $test
     * @param History $history
     * @param Guard $auth
     * @param Request $request
     */
    public function __construct(Tag $tag, Exam $test, History $history, Guard $auth, Request $request)
    {
        $this->test     = $test;
        $this->history  = $history;
        $this->auth     = $auth;
        $this->tag      = $tag;
        $this->middleware('auth', ['only' => ['create','edit']]);
        $this->middleware('tests.view_throttle', ['except' => ['create','edit','index']]);
        $this->request = $request;
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
    public function show($slug = null, $id)
	{
        $t = \Cache::tags('tests')->rememberForever("testShow$slug$id", function () use ($id) {
            return $this->test->getFirstBy('id',$id,['tagged','question']);
        });
        if (is_null($t)) abort(404);
        if ($t->slug != $slug)
            return redirect()->to($t->link());

        $haveHistory = false;
        if ($this->auth->check())
        {
            $haveHistory = $this->history
                            ->with('test')
                            ->where('test_id',$t->id)
                            ->where('user_id',$this->auth->user()->id)
                            ->get();
        }

        event(new ViewTestEvent($t, $this->request));
        // Define for blade template
        $viewHistory = false;
        return view('quiz.do',compact('t','haveHistory','viewHistory'));
	}

    /**
     * Show leaderboard of test
     *
     * @param null $slug
     * @param $t
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\View\View
     */
    public function leaderboard($slug = null, $id)
    {
        $t = \Cache::tags('tests')->rememberForever("testLeaderboard$slug$id", function () use ($id) {
            return $this->test->getFirstBy('id',$id,['tagged','question']);
        });
        if (is_null($t))
            abort(404);
        if ($t->slug != $slug)
            return redirect()->to($t->link('bangdiem'));

        $top = $this->history->orderBy('score','DESC')
            ->where('test_id',$t->id)
            ->where('is_first',1)
            ->where('isDone',1)
            ->with('user')
            ->paginate(50);

        event(new ViewTestEvent($t, $this->request));

        return view('quiz.leaderboard',compact('t','top'));

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
        $history = \Cache::tags('history')->rememberForever('history'.$id, function() use ($id){
            return $this->history->with('user','test.question')->findOrFail($id);
        });

        $t = $history->test;

        if ($t->slug != $slug)
            return redirect()->to('/quiz/ket-qua/'.$t->slug.'/'.$id);

        // Define for blade template
        $viewHistory = true;

        event(new ViewTestEvent($t, $this->request));

        return view('quiz.history',compact('t','history','viewHistory'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        $name = "Tạo đề thi mới";
        $data = [
            'type' => 'create',
            'tags' => $this->tag->tagListForSelect2(),
        ];

        $data = json_encode($data);

        return view('quiz.create',compact('data','name'));
    }

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($tests, ExamTransformers $transformer)
	{
        $name = 'Sửa đề thi';
        $data = [
            'type' => 'edit',
            'test' => $transformer->transform($tests),
            'tags' => $tests->selectedTags(),
        ];

        $data = json_encode($data);

        return view('quiz.create',compact('data','name'));
	}

}
