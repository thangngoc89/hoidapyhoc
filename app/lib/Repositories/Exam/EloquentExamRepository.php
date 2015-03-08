<?php namespace Quiz\lib\Repositories\Exam;

use Quiz\lib\Repositories\AbstractEloquentRepository;
use Quiz\Models\Exam;
use Quiz\Models\User;

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

    public function doneTest(User $user)
    {
        $exams = $this->model->whereIn('id',$this->doneTestId($user))->get();

        return $exams;
    }

    /**
     * Return an array of done exam by user
     * @param $user
     * @return mixed
     */
    public function doneTestId(User $user)
    {
        $exams = $this->model->select('exams.id')
            ->join('history', 'history.test_id', '=', 'exams.id')
            ->where('history.user_id', $user->id)
            ->groupBy('id')
            ->get()
            ->modelKeys();

        return $exams;
    }

    /**
     * @param \Quiz\Models\Exam $exam
     * @param int $amount
     * @return mixed
     */
    public function relatedExams($exam, $amount = 5)
    {
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
}