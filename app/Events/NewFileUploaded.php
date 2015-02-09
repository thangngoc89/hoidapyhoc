<?php namespace Quiz\Events;

use Quiz\Events\Event;

use Illuminate\Queue\SerializesModels;

class NewFileUploaded extends Event {

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
