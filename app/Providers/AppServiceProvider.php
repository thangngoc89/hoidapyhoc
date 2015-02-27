<?php namespace Quiz\Providers;

use Illuminate\Support\ServiceProvider;
use Log;

class AppServiceProvider extends ServiceProvider {

	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot()
	{
        /*
         * Register extra monolog handler
         */
        $monolog = Log::getMonolog();

        if (env('APP_ENV') === 'local')
        {
            $monolog->pushHandler($chromeHandler = new \Monolog\Handler\ChromePHPHandler());
            $chromeHandler->setFormatter(new \Monolog\Formatter\ChromePHPFormatter());
        }

        $slackHandler = new \Monolog\Handler\SlackHandler(
            'xoxp-3624260307-3624260313-3865278269-1baa67',
            '#general'
        );
        $monolog->pushHandler($slackHandler);
        $slackHandler->setFormatter(new \Monolog\Formatter\LineFormatter());

        $this->app->validator->resolver(function($translator, $data, $rules, $messages)
        {
            return new \Quiz\lib\Repositories\Exam\QuestionValidator($translator, $data, $rules, $messages);
        });
	}

	/**
	 * Register any application services.
	 *
	 * This service provider is a great spot to register your various container
	 * bindings with the application. As you can see, we are registering our
	 * "Registrar" implementation here. You can add your own bindings too!
	 *
	 * @return void
	 */
	public function register()
	{
		$this->app->bind(
			'Illuminate\Contracts\Auth\Registrar',
			'Quiz\Services\Registrar'
		);

        $this->app->bind(
            \Quiz\lib\Repositories\Video\VideoRepository::class,
            \Quiz\lib\Repositories\Video\EloquentVideoRepository::class
        );

        $this->app->bind(
            \Quiz\lib\Repositories\Exam\ExamRepository::class,
            \Quiz\lib\Repositories\Exam\EloquentExamRepository::class
        );

        $this->app->bind(
            'Quiz\lib\Repositories\User\UserRepository',
            'Quiz\lib\Repositories\User\EloquentUserRepository'
        );

        $this->app->bind(
            'Quiz\lib\Repositories\Upload\UploadRepository',
            'Quiz\lib\Repositories\Upload\EloquentUploadRepository'
        );
        $this->app->bind(
            'Quiz\lib\Repositories\Tag\TagRepository',
            'Quiz\lib\Repositories\Tag\EloquentTagRepository'
        );

        $this->app->bind(
            'Quiz\lib\Repositories\History\HistoryRepository',
            'Quiz\lib\Repositories\History\EloquentHistoryRepository'
        );

        $this->app->bind(
            'League\Fractal\Serializer\SerializerAbstract',
            'League\Fractal\Serializer\ArraySerializer'
        );
	}

}
