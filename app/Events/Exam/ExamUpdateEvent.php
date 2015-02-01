<?php namespace Quiz\Events\Test;

use Quiz\Events\Event;

use Illuminate\Queue\SerializesModels;

class ExamUpdateEvent extends Event {

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

}
