<?php namespace Quiz\Events;

use Quiz\Events\Event;

use Illuminate\Queue\SerializesModels;
use Quiz\lib\Repositories\Exam\ExamRepository;

class ViewTestEvent extends Event {

	use SerializesModels;

	/**
	 * Create a new event instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		//
	}

    public function handle(ExamRepository $test)
    {
        //
    }
}
