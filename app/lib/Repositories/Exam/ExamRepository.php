<?php namespace Quiz\lib\Repositories\Exam;

use Quiz\lib\Repositories\BaseRepository;

interface ExamRepository extends BaseRepository {

    public function doneTest($user);

    public function doneTestId($user);

    public function getByIdOrSlug($id,$slug);

    public function relatedExams($exam, $amount = 5);

}