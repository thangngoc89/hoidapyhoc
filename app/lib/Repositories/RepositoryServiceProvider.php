<?php namespace Quiz\lib\Repositories;

use Illuminate\Support\ServiceProvider;
use Quiz\Models\Exam;
use Quiz\lib\Repositories\Exam\EloquentExamRepository;
use Quiz\lib\Repositories\Exam\CacheDecorator;
use Quiz\Services\Cache\LaravelCache;

class RepositoryServiceProvider extends ServiceProvider {

	/**
	 * Bootstrap the application services.
	 *
	 * @return void
	 */
	public function boot()
	{
        /**
         * Exam Repository
         *
         * @return \Quiz\lib\Repositories\Exam\EloquentExamRepository
         */
        $this->app->bind(\Quiz\lib\Repositories\Exam\ExamRepository::class, function($app)
        {
            $exam = new EloquentExamRepository(
                new Exam
            );

            return new CacheDecorator(
                $exam,
                new LaravelCache($app['cache'], 'exams')
            );
        });
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
