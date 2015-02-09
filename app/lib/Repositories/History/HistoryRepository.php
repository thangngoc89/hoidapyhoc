<?php namespace Quiz\lib\Repositories\History;

use Quiz\lib\Repositories\BaseRepository;

interface HistoryRepository extends BaseRepository {

    public function findUserHistoryOfExam($examId, $userId);

    public function leaderBoardOfExam($examId, $perPage = 50);

}