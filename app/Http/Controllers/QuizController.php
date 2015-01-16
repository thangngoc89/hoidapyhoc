<?php namespace Quiz\Http\Controllers;

use Illuminate\Auth\Guard;
use Quiz\Models\Category;
use Quiz\Models\History;
use Quiz\Models\Exam;
use Quiz\Models\Question;

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
     * @var Test
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
     * @param Test|Exam $test
     * @param History $history
     * @param Guard $auth
     */
    public function __construct(Category $category, Question $question, Exam $test, History $history, Guard $auth)
    {

        $this->category = $category;
        $this->question = $question;
        $this->test = $test;
        $this->history = $history;
        $this->auth = $auth;
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
        $categories = \Cache::remember('CategoryListDesc',30, function()
        {
            $categories = $this->category->with('test')->has('test')->get()->sortByDesc(function($categories)
            {
                return $categories->test->count();
            });
            return $categories;
        });


        $tests = $tests->orderBy('tests.created_at','DESC')
            ->with('question','category','user','history')
            ->paginate(10);

        return view('quiz.index',compact('tests','categories','filter','c','name'));
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		//
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($slug)
	{
        $t = $this->test->findBySlugOrFail($slug);
        $history = false;

        if ($this->auth->check())
        {

            $history = $this->history->firstOrNew(
                array(
                    'user_id' => $this->auth->user()->id,
                    'test_id' => $t->id,
                    'isDone'  => 0
            ));
            $history->save();

        }

        return view('quiz.do',compact('t','history'));
	}

    public function showHistory($slug,$id)
    {
        $t = $this->test->findBySlugOrFail($slug);
        $history = $this->history->with('user')->findOrFail($id);

        if ($t->id != $history->test_id)
            return redirect()->to('quiz/t/'.$slug)->with('message', 'Không tìm thấy kết quả');

        return view('quiz.history',compact('t','history'));
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


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}


}
