<?php namespace Quiz\Commands\Exam;

use Quiz\Commands\Command;
use Quiz\Http\Requests\Exam\ExamCheckRequest;
use Quiz\Models\Exam;

class ExamCheckCommand extends Command {
    /**
     * @var Exam
     */
    public $exam;
    /**
     * @var ExamCheckRequest
     */
    public $request;

    /**
     * Create a new command instance.
     *
     * @param Exam $exam
     * @param ExamCheckRequest $request
     * @return \Quiz\Commands\Exam\ExamCheckCommand
     */
	public function __construct(Exam $exam, ExamCheckRequest $request)
	{
        $this->exam = $exam;
        $this->request = $request;
    }

}
