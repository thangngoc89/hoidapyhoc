<?php namespace Quiz\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider {

	/**
	 * The event handler mappings for the application.
	 *
	 * @var array
	 */
	protected $listen = [
		'event.name' => [
			'EventListener',
		],
        'Quiz\Events\ViewTestEvent' => [
            'Quiz\Handlers\Events\IncreaseViewCount@handle',
        ],
	];

}
