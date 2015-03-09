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
    private $paginate = 10;
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
        $this->request = $request;

        $tab = $this->switchMethod();

        $this->{$tab}();

        $view = $this->makeView();

        return $view;
    }

    private function doneTab()
    {
        if (! $this->auth->check())
            abort(403);
        $this->result = $this->exam->whereIn( 'id' ,$this->exam->doneTestId($this->auth->user()) );

        $userId = $this->auth->user()->id;

        $this->result = $this->exam->getUserDoneExamsWithRelations($userId, $this->paginate , ['tagged','user']);

        $this->name = 'Các đề bạn đã làm';
    }

    private function latestTab()
    {
        $this->result = $this->exam->getLatestExamsWithRelations($this->paginate, ['tagged','user']);
        $this->name = 'Quiz';
    }

    private function yourExamTab()
    {
        if ( ! $this->auth->check() )
            abort(403);

        $userId = $this->auth->user()->id;

        $this->result = $this->exam->getUserPostedExamWithRelations($userId, $this->paginate , ['tagged','user']);

        $this->name = 'Đề thi đã gửi';
    }


    private function switchMethod()
    {
        $tab = $this->request->tab;

        if ( !$tab )
            $tab = 'latest';

        if ( !method_exists($this, $tab.'Tab') )
            abort(404);

        $tab .= 'Tab';

        return $tab;
    }

    private function makeView()
    {
        $exams = $this->result;

        // Appends pagination
        $exams->appends($this->request->except('page'));

        $name = $this->name;

        return view('quiz.index',compact('exams','name'))->render();
    }
}