<?php namespace Quiz\Http\Controllers;

use Illuminate\Auth\Guard;
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
    public function index($filter = false, $info = false)
	{
        $c = false;
        switch($filter)
        {
            case 'hasHistory' :
                if ($this->auth->check())
                    $tests = $this->test->doneTest($this->auth->user());
                $name = 'Các đề bạn đã làm';
                break;
            case 'c' :
                $c = $this->category->findBySlugOrFail($info);
                $tests = $this->test->where('cid', $c->id);
                $name = $c->name;
                break;
            case null :
                $tests = $this->test;
                $name = 'Quiz';
                break;
            default :
                abort(404);
                break;
        }

        $categories = $this->categoryList();
        $doneTestId = $this->doneTestId();

        $key = 'index'.$filter.$info.\Input::get('page');

        $tests = \Cache::tags('tests','index')->remember($key, 10, function() use ($tests)
        {
            return $tests->has('question')->orderBy('tests.created_at','DESC')
                ->with('question','category','user','history')
                ->paginate(10);
        });
        return view('quiz.index',compact('tests','categories','filter','c','name','doneTestId'));
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
        $categories = $this->categoryList();
		return view('quiz.create',compact('categories'));
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($slug = null, $id = null)
	{
        $t = \Cache::tags('test')->rememberForever('test'.$id, function() use ($id, &$slug) {
            if (!is_null($id))
                return $this->test->getFirstBy('id',$id, ['question','category','file']);
            if (!is_null($slug))
                return $this->test->getFirstBy('slug',$slug, ['question','category','file']);
        });

        if (is_null($t)) abort(404);

        if (($t->slug != $slug) || ($id == null))
            return redirect()->to($t->link());
        $haveHistory = false;
        if ($this->auth->check())
        {
            $haveHistory = $this->history
                            ->where('test_id',$id)
                            ->where('user_id',$this->auth->user()->id)
                            ->get();
        }
        // Define for blade template
        $viewHistory = false;
        return view('quiz.do',compact('t','haveHistory','viewHistory'));
	}

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


    private function categoryList()
    {
        $key = 'categoryListDesc';
        $categories = \Cache::tags('category')->remember($key,30, function()
        {
            $categories = $this->category->with('test')->has('test')->get()->sortByDesc(function($categories)
            {
                return $categories->test->count();
            });
            return $categories;
        });
        return $categories;
    }

    private function doneTestId()
    {
        $doneTestId = ($this->auth->check()) ? $this->test->doneTestId($this->auth->user()) : false;
        return $doneTestId;
    }

}
