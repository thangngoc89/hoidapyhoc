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

    /**
     * Return an array of done exam by user
     * @param $user
     * @return mixed
     */
    public function doneTestId($user)
    {
        #TODO: Refactor and make this plain userId
        if ($user instanceof User)
            $userId = $user->id;
        else
            $userId = $user;

        $exams = $this->model->select('exams.id')
            ->join('history', 'history.test_id', '=', 'exams.id')
            ->where('history.user_id', $userId)
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

    /**
     * Return an collection of exams were posted by user
     *
     * @param $userId
     * @param null $paginated
     * @return \Illuminate\Support\Collection;
     */
    public function getUserPostedExamWithRelations($userId, $paginate = false, array $relations = [])
    {
        $query = $this->model->with($relations)->whereUserId($userId)->latest();

        return $this->paginateOrGet($query, $paginate);

    }

    /**
     * Return an collection of latest exams with relations
     *
     * @param bool $paginate
     * @param bool $approved
     * @return \Illuminate\Support\Collection;
     */
    public function getLatestExamsWithRelations($paginate = false, array $relations = [], $approved = true)
    {
        #TODO: Add is_approve query here
        $query = $this->model->with($relations)->latest();

        return $this->paginateOrGet($query, $paginate);
    }


    /**
     * Return an collection of exams were done by user
     *
     * @param $userId
     * @param bool $paginate
     * @param array $relations
     * @return \Illuminate\Support\Collection;
     */
    public function getUserDoneExamsWithRelations($userId, $paginate = false, array $relations = [])
    {
        $query = $this->model->whereIn('id' , $this->doneTestId($userId))->latest();

        return $this->paginateOrGet($query, $paginate);
    }
}