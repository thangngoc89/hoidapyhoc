<?php namespace Quiz\Commands\Exam;

use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Request;
use Quiz\Commands\Command;
use Quiz\Models\Exam;

class ExamUpdateCommand extends Command {

    use SerializesModels;
    /**
     * @var Exam
     */
    public $exam;
    /**
     * @var Request
     */
    public $request;

    /**
     * Create a new command instance.
     *
     * @param Exam $exam
     * @param Request $request
     * @return \Quiz\Commands\Exam\ExamUpdateCommand
     */
	public function __construct(Exam $exam, Request $request)
	{
        $this->exam = $exam;
        $this->request = $request;
    }

}
