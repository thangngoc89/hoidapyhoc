<?php namespace Quiz\Events\Exam;

use Illuminate\Http\Request;
use Quiz\Events\Event;

use Illuminate\Queue\SerializesModels;
use Quiz\Models\Exam;

class ExamViewEvent extends Event {

	use SerializesModels;
    /**
     * @var
     */
    public $test;
    /**
     * @var Request
     */
    public $request;
    /**
     * @var
     */

    /**
     * Create a new event instance.
     *
     * @param Exam $test
     * @param Request $request
     * @return \Quiz\Events\Exam\ExamViewEvent
     */
	public function __construct(Exam $exam, Request $request)
	{
        $this->exam = $exam;
        $this->request = $request;
    }

    public function handle()
    {
        //
    }
}
