<?php namespace Quiz\Events\Exam;

use Quiz\Events\Event;

use Illuminate\Queue\SerializesModels;
use Quiz\Models\Exam;

class ExamCreatedEvent extends Event {

	use SerializesModels;
    /**
     * @var Exam
     */
    public $exam;

    /**
     * Create a new event instance.
     *
     * @param Exam $exam
     * @return \Quiz\Events\Exam\ExamCreatedEvent
     */
	public function __construct(Exam $exam)
	{
        $this->exam = $exam;
    }

}
