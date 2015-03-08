<?php namespace Quiz\lib\Repositories\Exam;

use Quiz\lib\Repositories\BaseRepository;
use Quiz\Models\User;

interface ExamRepository extends BaseRepository {

    #TODO: Should these query belongs to UserRepository ?
    public function doneTest(User $user);

    /**
     * Return an array of done exam by user
     *
     * @param $user
     * @return mixed
     */
    public function doneTestId(User $user);

    /**
     * Return an collection of related exams by current exam tags
     *
     * @param $exam
     * @param int $amount
     * @return \Illuminate\Support\Collection;
     */
    public function relatedExams($exam, $amount = 5);

}