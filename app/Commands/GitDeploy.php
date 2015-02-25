<?php namespace Quiz\Commands;

use Illuminate\Http\Request;
use Quiz\Commands\Command;

class GitDeploy extends Command {
    /**
     * @var Request
     */
    public $request;

    /**
     * Create a new command instance.
     *
     * @param Request $request
     * @return \Quiz\Commands\GitDeploy
     */
	public function __construct(Request $request)
	{
        $this->request = $request;
    }

}
