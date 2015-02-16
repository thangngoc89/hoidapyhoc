<?php namespace Quiz\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Contracts\Events\Dispatcher as DispatcherContract;

use Quiz\Models\Upload;

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

        /** ------------------------------------------
         *  Exam's events
         *  ------------------------------------------
         */
        \Quiz\Events\Exam\ExamViewEvent::class => [
            \Quiz\Handlers\Events\IncreaseViewCount::class,
        ],
        \Quiz\Events\Exam\ExamUpdatedEvent::class => [
            \Quiz\Handlers\Events\Exam\RebakeHistoryScore::class,
        ],
        /** ------------------------------------------
         *  Video's events
         *  ------------------------------------------
         */
        \Quiz\Events\Video\VideoViewEvent::class => [
            \Quiz\Handlers\Events\IncreaseViewCount::class,
        ],

        /** ------------------------------------------
         *  General events
         *  ------------------------------------------
         */
        \Quiz\Events\NewFileUploaded::class=>[
            \Quiz\Handlers\Events\BackupUploadedFile::class,
            \Quiz\Handlers\Events\RotateImage::class,
        ]
	];

}
