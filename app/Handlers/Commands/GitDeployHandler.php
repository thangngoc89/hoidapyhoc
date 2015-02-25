<?php namespace Quiz\Handlers\Commands;

use Illuminate\Http\Request;
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
        if ($this->checkSignature($request))
            $this->runDeploy();
	}

    private function checkHeader(Request $request)
    {
        $githubDelivery = $request->header('X-GitHub-Delivery');
        $event = $request->header('X-GitHub-Event');

        if ( empty($githubDelivery) )
            abort(400);

        if ( $event != 'ping' )
            abort(400);
    }

    private function checkSignature(Request $request)
    {
        $hubSignature = $request->header('X-Hub-Signature');
        $payload = $request->getContent();

        $secretKey = getenv('GIT_WEBHOOK_SECRET');

        list($algo, $hash) = explode('=', $hubSignature, 2);

        $payloadHash = hash_hmac($algo, $payload, $secretKey);

        if ($hash !== $payloadHash) {
            die('Secret key was not matched.');
        }

        return true;
    }

    private function runDeploy()
    {
        echo 'starting deployment';
    }

}
