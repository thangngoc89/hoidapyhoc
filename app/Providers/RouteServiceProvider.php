<?php namespace Quiz\Providers;

use Illuminate\Routing\Router;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider {
    /**
     * This namespace is applied to the controller routes in your routes file.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'Quiz\Http\Controllers';
    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @param  \Illuminate\Routing\Router  $router
     * @return void
     */
    public function boot(Router $router)
    {
        parent::boot($router);

        $router->model('exams', \Quiz\Models\Exam::class);
        $router->model('quiz', \Quiz\Models\Exam::class);
        $router->model('users', \Quiz\Models\User::class);
        $router->model('roles', \Quiz\Models\Role::class);
        $router->model('permissions', \Quiz\Models\Permission::class);
        $router->model('tags', \Quiz\lib\Tagging\Tag::class);
        $router->model('testimonials', \Quiz\Models\Testimonial::class);
        $router->model('videos', \Quiz\Models\Video::class);
        $router->model('files', \Quiz\Models\Upload::class);
    }
    /**
     * Define the routes for the application.
     *
     * @param  \Illuminate\Routing\Router  $router
     * @return void
     */
    public function map(Router $router)
    {
        $router->get('admin/logs', [
            'uses' => 'Rap2hpoutre\LaravelLogViewer\LogViewerController@index',
            'middleware' => ['admin']
        ]);

        $router->group(['namespace' => $this->namespace], function($router)
        {
            require app_path('Http/routes.php');
        });
    }
}
