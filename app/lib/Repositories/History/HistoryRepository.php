<?php namespace Quiz\lib\Repositories\History;

use Quiz\lib\Repositories\BaseRepository;

interface HistoryRepository extends BaseRepository {

    public function findUserDoneHistoryOfExam($examId, $userId);

    public function leaderBoardOfExamAndPaginated($examId, $perPage = 50);

    public function recentDoneExam($userId, $limit = 5);

    public function userRankOfExam($examId, $userId);
}