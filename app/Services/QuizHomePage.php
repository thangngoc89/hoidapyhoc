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
    private $exam;
    private $request;
    private $result;
    private $name;
    /**
     * @var Cache
     */
    private $cache;

    /**
     * @param Guard $auth
     * @param ExamRepository $exam
     * @param Cache $cache
     */
    public function __construct(Guard $auth, ExamRepository $exam, Cache $cache)
    {
        $this->auth = $auth;
        $this->exam = $exam;
        $this->cache = $cache;
    }
    public function execute($request)
    {
        $key = $request->url().$request->tab.$request->page;

        $cache = $this->cache->tags('index','tests');

        if ($cache->has($key) && getenv('APP_ENV') != 'local')
            return $cache->get($key);

        $this->request = $request;

        $tab = $this->switchMethod();

        $this->{$tab}();

        $view = $this->makeView();

        $cache->put($key,$view,20);

        return $view;
    }

    private function doneTab()
    {
        if (! $this->auth->check())
            abort(503);
        $this->result = $this->exam->doneTest($this->auth->user());

        $this->name = 'Các đề bạn đã làm';
    }

    private function latestTab()
    {
        $this->result = $this->exam->orderBy('tests.created_at','DESC');
        $this->name = 'Quiz';
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
        $exams = $this->result->with('tagged','user')->paginate(10);;

        // Appends pagination
        $exams->appends($this->request->except('tab'));

        $name = $this->name;

        $doneTestId = false;

        if ($this->auth->check())
            $doneTestId = $this->exam->doneTestId($this->auth->user());

        return view('quiz.index',compact('tests','name','doneTestId'))->render();
    }
} 