<?php namespace Quiz\Http\Controllers;

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
     * @param Category $category
     * @param Question $question
     * @param Test $test
     * @param History $history
     */
    public function __construct(Category $category, Question $question, Exam $test, History $history)
    {

        $this->category = $category;
        $this->question = $question;
        $this->test = $test;
        $this->history = $history;
    }

    /**
     * @param bool $filter
     * @param bool $info
     * @return mixed
     */
    public function index($filter = false, $info = false)
	{
        switch($filter)
        {
            case 'hasHistory' :
                // Get id of all done test by user.
                $tests = $this->test->select('tests.id')
                    ->join('history', 'history.test_id', '=', 'tests.id')
                    ->where('history.user_id', Auth::user()->id)
                    ->groupBy('id')
                    ->get();

                $tests = $this->test->whereIn('id',$tests->modelKeys());
                break;
            // Show Tests from A specific Category
            case 'c' :
                $c = $this->category->where('slug', $info)->first();
                if (is_null($c))
                {
                    return App::abort(404);
                }
                $tests = $this->test->where('cid', $c->id);
                break;

            default :
                $tests = $this->test;
                break;
        }

        $categories = $this->category->with('test')->has('test')->get()->sortByDesc(function($categories)
        {
            return $categories->test->count();
        });
        $tests = $tests->orderBy('tests.created_at','DESC')
            ->with('question','category','user','history')
//            ->has('question')
            ->paginate(10);
        $paging = (string)$tests->links();

        return View::make('quiz.index',compact('tests','categories','filter','info','paging'));
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
        $t = $this->test->with('question')
            ->where('slug', '=', $slug)
            ->first();
        // Check if the test exists
        if (is_null($t))
        {
            return App::abort(404);
        }
        $history = false;
        if (Auth::check())
        {
            $history = $this->history->firstOrNew(
                array(
                    'user_id' => Auth::user()->id,
                    'test_id' => $t->id,
                    'isDone'  => 0
            ));
            $history->save();
        }
        return View::make('quiz.do',compact('t','history'));
	}

    public function showHistory($slug,$id)
    {
        $t = $this->test->with('question')
            ->where('slug', '=', $slug)
            ->first();
        // Check if the test exists
        if (is_null($t))
        {
            return App::abort(404);
        }
        $history = $this->history->with('user')->findOrFail($id);
        return View::make('quiz.history',compact('t','history'));
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
