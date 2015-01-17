<?php namespace Quiz\lib\Repositories\Exam;

use Quiz\lib\Repositories\AbstractEloquentRepository;
use Quiz\Models\Exam;

class EloquentExamRepository extends AbstractEloquentRepository implements ExamRepository {
    /**
     * @var Exam
     */
    protected $model;

    /**
     * @param Exam $model
     */
    public function __construct(Exam $model)
    {
        $this->model = $model;
    }

    /**
     * Return an array of done test by user
     * @param $user
     * @return mixed
     */
    public function doneTestId($user)
    {
        $tests = $this->model->select('tests.id')
            ->join('history', 'history.test_id', '=', 'tests.id')
            ->where('history.user_id', $user->id)
            ->groupBy('id')
            ->get()
            ->modelKeys();

        return $tests;
    }

    /**
     * Interface Part
     *
     */

    public function link()
    {
        return '/quiz/'.$this->slug.'/'.$this->id;
    }
}