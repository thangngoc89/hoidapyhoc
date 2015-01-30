<?php namespace Quiz\Services;

use Illuminate\Contracts\Auth\Guard;
use Quiz\lib\Repositories\Exam\ExamRepository;

class QuizHomePage {
    /**
     * @var Guard
     */
    private $auth;
    /**
     * @var ExamRepository
     */
    private $test;

    /**
     * @param Guard $auth
     * @param ExamRepository $test
     */
    public function __construct(Guard $auth, ExamRepository $test)
    {
        $this->auth = $auth;
        $this->test = $test;
    }
    public function execute($request)
    {
        switch($request->tab)
        {
            case 'done' :
                if (! $this->auth->check())
                    return redirect('quiz');
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

        $key = $request->url().$request->page;

        $tests = \Cache::tags('tests','index')->remember($key, 10, function() use ($tests)
        {
            return $tests->has('question')->with('tagged','user')->paginate(20);
        });
        $tests->appends($request->only('tab'));

        return view('quiz.index',compact('tests','name','doneTestId'));
    }
} 