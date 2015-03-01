<?php namespace Quiz\lib\Composers;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\View\View;
use Quiz\lib\Repositories\Exam\ExamRepository;

class UserDoneExamIds {
    /**
     * @var ExamRepository
     */
    private $exam;
    /**
     * @var Guard
     */
    private $auth;

    /**
     * @param ExamRepository $exam
     * @param Guard $auth
     */
    public function __construct(ExamRepository $exam, Guard $auth)
    {
        $this->exam = $exam;
        $this->auth = $auth;
    }

    public function compose(View $view)
    {
        $doneTestId = false;

        if ($this->auth->check())
            $doneTestId = $this->exam->doneTestId($this->auth->user());

        $view->with('doneTestId', compact('doneTestId'));
    }
} 