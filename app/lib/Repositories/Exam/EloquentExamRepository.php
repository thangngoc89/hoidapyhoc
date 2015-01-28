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
        $key = 'userDoneTest'.$user->id;

        $tests = \Cache::tags('history','user'.$user->id)
                ->rememberForever($key,function() use ($user) {

                    return $this->model->select('tests.id')
                        ->join('history', 'history.test_id', '=', 'tests.id')
                        ->where('history.user_id', $user->id)
                        ->groupBy('id')
                        ->get()
                        ->modelKeys();
                });

        return $tests;
    }

    public function doneTest($user)
    {
        $tests = $this->model->whereIn('id',$this->doneTestId($user));
        return $tests;
    }

    public function getByIdOrSlug($id,$slug)
    {
        return \Cache::tags('test')->rememberForever('test'.$id, function() use ($id, &$slug) {
            if (!is_null($id))
                return $this->getFirstBy('id',$id, ['question','category','file']);
            if (!is_null($slug))
                return $this->getFirstBy('slug',$slug, ['question','category','file']);
        });
    }


}