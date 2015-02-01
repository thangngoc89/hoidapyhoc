<?php namespace Quiz\Events\User;

use Quiz\Events\Event;

use Illuminate\Queue\SerializesModels;

class UserCreateEvent extends Event {

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
