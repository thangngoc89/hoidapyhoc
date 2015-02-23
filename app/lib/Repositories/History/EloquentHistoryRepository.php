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

    /**
     * Find all previous history done by User on a single exam
     *
     * @param $examId
     * @param $userId
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function findUserDoneHistoryOfExam($examId, $userId)
    {
        return $this->model
            ->with('exam')
            ->where('test_id',$examId)
            ->where('user_id',$userId)
            ->where('isDone',1)
            ->get();
    }

    /**
     * All history of one exam
     *
     * @param $examId
     * @param int $perPage
     * @return mixed
     */
    public function leaderBoardOfExamAndPaginated($examId, $perPage = 50)
    {
        return $this->model->orderBy('score','DESC')
            ->where('test_id',$examId)
            ->where('is_first',1)
            ->where('isDone',1)
            ->with('user')
            ->paginate($perPage);
    }

    /**
     * User's recent done exam
     *
     * @param $userId
     * @param int $limit
     * @return mixed
     */
    public function recentDoneExam($userId, $limit = 5)
    {
        return $this->model->where('user_id',$userId)
            ->with('exam')
            ->done()
            ->isFirst()
            ->orderBy('updated_at','DESC')
            ->take($limit)
            ->get();
    }

    /**
     * @param $examId
     * @param $userId
     * @return mixed
     */
    public function firstHistoryOfUserOfExam($examId, $userId)
    {
        return $this->model
            ->where('test_id',$examId)
            ->where('user_id',$userId)
            ->where('is_first',1)
            ->where('isDone',1)
            ->first();
    }


    public function userRankOfExam($examId, $userId)
    {
        $history = $this->firstHistoryOfUserOfExam($examId, $userId);

        if (is_null($history))
            return null;

//        dd($history->score);

        return $this->model->where('test_id','=', $examId)
            ->where('score','>=', $history->score)
            ->where('user_id',$userId)
            ->where('is_first',1)
            ->where('isDone',1)
            ->count();
    }

}