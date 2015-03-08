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
			\Illuminate\Contracts\Auth\Registrar::class,
			\Quiz\Services\Registrar::class
		);

        $this->app->bind(
            \Quiz\lib\Repositories\Video\VideoRepository::class,
            \Quiz\lib\Repositories\Video\EloquentVideoRepository::class
        );

//        $this->app->bind(
//            \Quiz\lib\Repositories\Exam\ExamRepository::class,
//            \Quiz\lib\Repositories\Exam\EloquentExamRepository::class
//        );

        $this->app->bind(
            \Quiz\lib\Repositories\User\UserRepository::class,
            \Quiz\lib\Repositories\User\EloquentUserRepository::class
        );

        $this->app->bind(
            \Quiz\lib\Repositories\Upload\UploadRepository::class,
            \Quiz\lib\Repositories\Upload\EloquentUploadRepository::class
        );
        $this->app->bind(
            \Quiz\lib\Repositories\Tag\TagRepository::class,
            \Quiz\lib\Repositories\Tag\EloquentTagRepository::class
        );

        $this->app->bind(
            \Quiz\lib\Repositories\History\HistoryRepository::class,
            \Quiz\lib\Repositories\History\EloquentHistoryRepository::class
        );
        $this->app->bind(
            \Quiz\lib\Repositories\Profile\ProfileRepository::class,
            \Quiz\lib\Repositories\Profile\EloquentProfileRepository::class
        );
	}

}
