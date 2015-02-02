<?php namespace Quiz\Commands\Exam;

use Illuminate\Http\Request;
use Quiz\Commands\Command;

class ExamCreateCommand extends Command {
    /**
     * @var Request
     */
    public $request;


    /**
     * Create a new command instance.
     *
     * @param Request $request
     * @return \Quiz\Commands\Exam\ExamCreateCommand
     */
	public function __construct(Request $request)
	{
        $this->request = $request;
    }

}
