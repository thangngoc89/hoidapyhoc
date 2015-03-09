<?php namespace Quiz\lib\Repositories\Exam;

use Quiz\lib\Repositories\BaseRepository;
use Quiz\Models\User;

interface ExamRepository extends BaseRepository {

    /**
     * Return an array of done exam by user
     *
     * @param $user
     * @return mixed
     */
    public function doneTestId($user);

    /**
     * Return an collection of related exams by current exam tags
     *
     * @param $exam
     * @param int $amount
     * @return \Illuminate\Support\Collection;
     */
    public function relatedExams($exam, $amount = 5);

    /**
     * Return an collection of exams were posted by user
     *
     * @param $userId
     * @param bool $paginate
     * @param array $relations
     * @internal param null $paginated
     * @return \Illuminate\Support\Collection;
     */
    public function getUserPostedExamWithRelations($userId, $paginate = false, array $relations = []);

    /**
     * Return an collection of latest exams with relations
     * @param bool $paginate
     * @param bool $approved
     * @return \Illuminate\Support\Collection;
     */
    public function getLatestExamsWithRelations($paginate = false, array $relations = [], $approved = true);

    /**
     * Return an collection of exams were done by user
     *
     * @param $userId
     * @param bool $paginate
     * @param array $relations
     * @return \Illuminate\Support\Collection;
     */
    public function getUserDoneExamsWithRelations($userId, $paginate = false, array $relations = []);

}