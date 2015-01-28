<?php namespace Quiz\Http\Controllers;

use Illuminate\Auth\Guard;
use Quiz\lib\Tagging\Tag;
use Quiz\Models\Category;
use Quiz\Models\History;
use Quiz\lib\Repositories\Exam\ExamRepository as Exam;
use Quiz\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Contracts\Pagination;

class QuizController extends Controller {

    /**
     * @var Category
     */
    private $category;
    /**
     * @var Question
     */
    private $question;
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
     * @param Category $category
     * @param Question $question
     * @param Exam $test
     * @param History $history
     * @param Guard $auth
     */
    public function __construct(Category $category, Question $question, Exam $test, History $history, Guard $auth)
    {
        $this->category = $category;
        $this->question = $question;
        $this->test     = $test;
        $this->history  = $history;
        $this->auth     = $auth;
    }

    /**
     * @param bool $filter
     * @param bool $info
     * @return mixed
     */
    public function index()
	{
        $tab = \Input::get('tab');
        switch($tab)
        {
            case 'done' :
                if ($this->auth->check())
                    $tests = $this->test->doneTest($this->auth->user());
                $name = 'Các đề bạn đã làm';
                break;
            case null :
                $tests = $this->test->orderBy('tests.created_at','DESC');
                $name = 'Quiz';
                break;
            default :
                return redirect('quiz');
        }

        $doneTestId = ($this->auth->check()) ? $this->test->doneTestId($this->auth->user()) : false;

        $key = 'index'.$tab.\Input::get('page');
        $tests = \Cache::tags('tests','index')->remember($key, 10, function() use ($tests)
        {
            return $tests->has('question')->with('tagged','user')->paginate(20);
        });

        return view('quiz.index',compact('tests','name','doneTestId'));
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{

        #TODO Cache this
        $tagList = Tag::all()->sortByDesc(function($tag)
        {
            return $tag->exams->count();
        });

        $tags = array();
        foreach($tagList as $tag)
        {
            $tags[] = [
                'id' => $tag->name,
                'text' => $tag->name,
                'count' => $tag->exams->count()
            ];
        }
        $tags = json_encode($tags);

		return view('quiz.create',compact('tags'));
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($slug = null, $t)
	{
        if ($t->slug != $slug)
            return redirect()->to($t->link());

        $haveHistory = false;
        if ($this->auth->check())
        {
            $haveHistory = $this->history
                            ->where('test_id',$t->id)
                            ->where('user_id',$this->auth->user()->id)
                            ->get();
        }
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
            return redirect()->to($t->link());

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
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}

}
