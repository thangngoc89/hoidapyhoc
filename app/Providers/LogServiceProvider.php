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
        if (env('APP_ENV') != 'local')
            return;
            $monolog->pushHandler($chromeHandler = new \Monolog\Handler\ChromePHPHandler());
            $chromeHandler->setFormatter(new \Monolog\Formatter\ChromePHPFormatter());
    }

    /**
     * @param $monolog
     */
    private function bootSlack($monolog)
    {
        if (env('APP_ENV') === 'local')
            return;

            $slackHandler = new \Monolog\Handler\SlackHandler(
                config('services.slack.api_key'),
                config('services.slack.channel')
            );
            $monolog->pushHandler($slackHandler);
            $slackHandler->setLevel(100);
            $slackHandler->setFormatter(new \Monolog\Formatter\LineFormatter());
    }

}
