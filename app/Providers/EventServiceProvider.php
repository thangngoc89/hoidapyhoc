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
        \Quiz\Events\ViewTestEvent::class => [
            \Quiz\Handlers\Events\Exam\IncreaseViewCount::class,
        ],
        \Quiz\Events\Exam\ExamUpdatedEvent::class => [
            \Quiz\Handlers\Events\Exam\RebakeHistoryScore::class,
        ],
        \Quiz\Events\NewFileUploaded::class=>[
            \Quiz\Handlers\Events\UploadFileToS3::class,
        ]
	];

}
