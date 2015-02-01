<?php namespace Quiz\Events;

use Illuminate\Http\Request;
use Quiz\Events\Event;

use Illuminate\Queue\SerializesModels;
use Quiz\Models\Exam;

class ViewTestEvent extends Event {

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
     * @return \Quiz\Events\ViewTestEvent
     */
	public function __construct(Exam $test, Request $request)
	{
        $this->test = $test;
        $this->request = $request;
    }

    public function handle()
    {
        //
    }
}
