<?php namespace Quiz\Events\Test;

use Quiz\Events\Event;

use Illuminate\Queue\SerializesModels;

class TestCreateEvent extends Event {

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
