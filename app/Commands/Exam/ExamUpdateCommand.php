<?php namespace Quiz\Commands\Exam;

use Illuminate\Queue\SerializesModels;
use Quiz\Commands\Command;
use Quiz\Http\Requests\Exam\ExamUpdateRequest;
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
     * @param ExamUpdateRequest $request
     * @return \Quiz\Commands\Exam\ExamUpdateCommand
     */
	public function __construct(Exam $exam, ExamUpdateRequest $request)
	{
        $this->exam = $exam;
        $this->request = $request;
    }

}
