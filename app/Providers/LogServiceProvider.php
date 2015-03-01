<?php namespace Quiz\Providers;

use Illuminate\Support\ServiceProvider;
use Log;
class LogServiceProvider extends ServiceProvider {

	/**
	 * Bootstrap the application services.
	 *
	 * @return void
	 */
	public function boot()
	{
        $monolog = Log::getMonolog();

        $this->bootChromePHP($monolog);

        $this->bootSlack($monolog);

	}
	/**
	 * Register the application services.
	 *
	 * @return void
	 */
	public function register()
	{
		//
	}

    /**
     * @param $monolog
     */
    private function bootChromePHP($monolog)
    {
        if (env('APP_ENV') === 'local') {
            $monolog->pushHandler($chromeHandler = new \Monolog\Handler\ChromePHPHandler());
            $chromeHandler->setFormatter(new \Monolog\Formatter\ChromePHPFormatter());
        }
    }

    /**
     * @param $monolog
     */
    private function bootSlack($monolog)
    {
        $slackHandler = new \Monolog\Handler\SlackHandler(
            'xoxp-3624260307-3624260313-3865278269-1baa67',
            'general'
        );
        $monolog->pushHandler($slackHandler);
        $slackHandler->setFormatter(new \Monolog\Formatter\LineFormatter());
        $slackHandler->setLevel(100);
    }

}
