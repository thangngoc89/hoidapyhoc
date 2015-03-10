<?php
namespace Quiz\lib\ExternalLink\Shorten;

use Illuminate\Support\ServiceProvider;

class LinkShortenServiceProvider extends ServiceProvider {

	/**
	 * Bootstrap the application services.
	 *
	 * @return void
	 */
	public function boot()
	{
        $this->app->bind(
            ShortenInterface::class,
            BitlyShorten::class
        );
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
}
