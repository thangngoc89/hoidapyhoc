<?php
namespace Quiz\lib\Repositories\Exam;

use Quiz\lib\Repositories\BaseRepository;

abstract class AbstractExamDecorator implements BaseRepository, ExamRepository {

    /**
     * @var ExamRepository
     */
    protected $exam;

    /**
     * @param ExamRepository $exam
     */
    public function __construct(ExamRepository $exam)
    {
        $this->exam = $exam;
    }

}