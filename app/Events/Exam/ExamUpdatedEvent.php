<?php namespace Quiz\Events\Exam;

use Quiz\Events\Event;

use Illuminate\Queue\SerializesModels;
use Quiz\Models\Exam;

class ExamUpdatedEvent extends Event {

	use SerializesModels;

    public $test;

    /**
     * Create a new event instance.
     *
     * @param Exam $test
     * @return \Quiz\Events\Test\ExamUpdatedEvent
     */
	public function __construct(Exam $test)
	{
        $this->test = $test;
    }

}
