<?php namespace Quiz\lib\Repositories\History;

use Quiz\lib\Repositories\AbstractEloquentRepository;
use Quiz\Models\History;

class EloquentHistoryRepository extends AbstractEloquentRepository implements HistoryRepository {
    /**
     * @var History
     */
    protected $model;

    /**
     * @param History $model
     */
    public function __construct(History $model)
    {
        $this->model = $model;
    }

    public function findUserHistoryOfExam($examId, $userId)
    {
        return $this->model
            ->with('exam')
            ->where('test_id',$examId)
            ->where('user_id',$userId)
            ->get();
    }

    public function leaderBoardOfExam($examId, $perPage = 50)
    {
        return $this->model->orderBy('score','DESC')
                ->where('test_id',$examId)
                ->where('is_first',1)
                ->where('isDone',1)
                ->with('user')
                ->paginate($perPage);
    }

    public function recentDoneExam($userId, $limit = 5)
    {
        return $this->model->where('user_id',$userId)
            ->with('exam')
            ->orderBy('updated_at','DESC')
            ->take($limit)
            ->get();
    }

}