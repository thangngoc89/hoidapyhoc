<?php namespace Quiz\Handlers\Commands;

use Quiz\Commands\GitDeploy;

use Illuminate\Queue\InteractsWithQueue;

class GitDeployHandler {

	/**
	 * Create the command handler.
	 *
	 * @return void
	 */
	public function __construct()
	{
		//
	}

	/**
	 * Handle the command.
	 *
	 * @param  GitDeploy  $command
	 * @return void
	 */
	public function handle(GitDeploy $command)
	{
		$request = $command->request;

        $this->checkHeader($request);
	}

    private function checkHeader($request)
    {

    }

}
