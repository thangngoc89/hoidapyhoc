<?php namespace Quiz\Providers;

use View;
use Illuminate\Support\ServiceProvider;

class ComposerServiceProvider extends ServiceProvider {

    /**
     * Register bindings in the container.
     *
     * @return void
     */
    public function boot()
    {
        // Using class based composers...
        View::composer('partials.tags', 'Quiz\lib\Composers\TagsListComposer');
        View::composer(['partials.header','site.admin'], 'Quiz\lib\Composers\EncryptedTokenComposer');
        View::composer('quiz.indexContent', 'Quiz\lib\Composers\UserDoneExamIds');
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
        //
    }

}
