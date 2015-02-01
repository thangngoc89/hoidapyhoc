<?php namespace Quiz\Handlers\Events\Exam;

use Quiz\Events\Exam\ExamUpdateEvent;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldBeQueued;

class RebakeHistoryScore implements ShouldBeQueued {

	use InteractsWithQueue;

	/**
	 * Create the event handler.
	 *
	 * @return void
	 */
	public function __construct()
	{
		//
	}

	/**
	 * Handle the event.
	 *
	 * @param  ExamUpdateEvent  $event
	 * @return void
	 */
	public function handle(ExamUpdateEvent $event)
	{
		//
	}

}
