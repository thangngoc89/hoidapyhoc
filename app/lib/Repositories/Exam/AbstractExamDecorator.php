<?php
namespace Quiz\lib\Repositories\Exam;

use Quiz\lib\Repositories\AbstractBaseDecorator;
use Quiz\lib\Repositories\BaseRepository;

abstract class AbstractExamDecorator extends AbstractBaseDecorator implements BaseRepository, ExamRepository {

    /**
     * @var ExamRepository
     */
    protected $repo;

    /**
     * @param ExamRepository $exam
     */
    public function __construct(ExamRepository $repo)
    {
        $this->repo = $repo;
    }

}