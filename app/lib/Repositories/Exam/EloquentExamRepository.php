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

                    return $this->model->select('exams.id')
                        ->join('history', 'history.test_id', '=', 'exams.id')
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
        return \Cache::tags('tests')->rememberForever('test'.$id, function() use ($id, &$slug) {
            if (!is_null($id))
                return $this->getFirstBy('id',$id, ['question','category','file']);
            if (!is_null($slug))
                return $this->getFirstBy('slug',$slug, ['question','category','file']);
        });
    }

    public function relatedExams($exam, $amount = 5)
    {
        $exam = $this->getItem($exam);

        $exam->load(['tagged.exams' => function ($q) use ( &$relatedExams, $exam, $amount ) {
            $relatedExams = $q->where('exams.id', '<>', $exam->id)->limit($amount)->get()->unique();
        }]);


        if (is_null($relatedExams))
        {
            $count = 0;
            $currentIds = [];
        } else {
            $count = $relatedExams->count();
            $currentIds = $relatedExams->lists('id');
        }
        if ($count < $amount)
        {
            $currentIds []= $exam->id;

            $moreRelatedExams = $this->model->orderByRaw('RAND()')->whereNotIn('id',$currentIds)->take($amount-$count)->get();
            $relatedExams = is_null($relatedExams) ? $moreRelatedExams : $relatedExams->merge($moreRelatedExams);
        }


        return $relatedExams;
    }

    private function getItem($exam)
    {
        if ($exam instanceof $this->model)
            return $exam;

        return $this->model->find($exam);
    }
}