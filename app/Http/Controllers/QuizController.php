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
     * @param Tag $tag
     * @param Exam $test
     * @param History $history
     * @param Guard $auth
     */
    public function __construct(Tag $tag, Exam $test, History $history, Guard $auth)
    {
        $this->test     = $test;
        $this->history  = $history;
        $this->auth     = $auth;
        $this->tag      = $tag;
        $this->middleware('auth', ['except' => ['index','show','showHistory','leaderboard']]);
    }

    /**
     * @param bool $filter
     * @param bool $info
     * @return mixed
     */
    public function index(Request $request, QuizHomePage $view)
	{
        return $view->execute($request);
	}


    /**
     * Display a quiz test page
     * @param null $slug
     * @param $t
     * @return \Illuminate\View\View
     */
    public function show($slug = null, $t)
	{
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

        event(new ViewTestEvent($t));
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
    public function leaderboard($slug = null, $t)
    {
        if ($t->slug != $slug)
            return redirect()->to($t->link('bangdiem'));

        $top = $this->history->orderBy('score','DESC')
            ->where('test_id',$t->id)
            ->where('is_first',1)
            ->where('isDone',1)
            ->with('user')
            ->paginate(50);

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
