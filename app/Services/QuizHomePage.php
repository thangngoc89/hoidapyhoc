<?php namespace Quiz\Services;

use Illuminate\Contracts\Auth\Guard;
use Quiz\lib\Repositories\Exam\ExamRepository;
use Illuminate\Cache\Repository as Cache;

class QuizHomePage {
    /**
     * @var Guard
     */
    private $auth;
    /**
     * @var ExamRepository
     */
    private $test;

    private $doneTestId;

    private $request;

    private $result;

    private $name;
    /**
     * @var Cache
     */
    private $cache;

    /**
     * @param Guard $auth
     * @param ExamRepository $test
     * @param Cache $cache
     */
    public function __construct(Guard $auth, ExamRepository $test, Cache $cache)
    {
        $this->auth = $auth;
        $this->test = $test;
        $this->cache = $cache;
    }
    public function execute($request)
    {
        $key = $request->url().$request->tab.$request->page;

        $cache = $this->cache->tags('index','tests');

        if ($cache->has($key))
            return $cache->get($key);

        $this->request = $request;

        $tab = $this->switchMethod();

        $this->{$tab}();

        $this->setDoneTestId();

        $view = $this->makeView();

        $cache->put($key,$view,20);

        return $view;
    }

    private function doneTab()
    {
        if (! $this->auth->check())
            abort(503);
        $this->result = $this->test->doneTest($this->auth->user());

        $this->name = 'Các đề bạn đã làm';
    }

    private function latestTab()
    {
        $this->result = $this->test->orderBy('tests.created_at','DESC');
        $this->name = 'Quiz';
    }
    /**
     * @param mixed $doneTestId
     */
    public function setDoneTestId()
    {
        $this->doneTestId = ($this->auth->check()) ? $this->test->doneTestId($this->auth->user()) : false;
    }

    private function switchMethod()
    {
        $tab = $this->request->tab;

        if (!$tab)
            $tab = 'latest';
        if (!in_array($tab, ['done','latest']))
            abort(404);

        $tab .= 'Tab';

        return $tab;
    }

    private function makeView()
    {
        $tests = $this->result->has('question')->with('tagged','user')->paginate(10);;

        $tests->appends($this->request->only('tab'));

        $name  = $this->name;
        $doneTestId = $this->doneTestId;

        return view('quiz.index',compact('tests','name','doneTestId'))->render();
    }
} 