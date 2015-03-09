<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
/** ------------------------------------------
 *  Route constraint patterns
 *  ------------------------------------------
 */

Route::pattern('id', '[0-9]+');
Route::pattern('exams', '[0-9]+');
Route::pattern('permissions', '[0-9]+');

/** ------------------------------------------
 *  HomePage Group
 *  ------------------------------------------
 */
Route::get('/',['uses' => 'Web\HomeController@index', 'as' => 'home']);
Route::get('thongke',['uses' => 'Web\HomeController@statistic', 'as' => 'site.statistic']);
Route::get('testimonials', ['uses' => 'Web\HomeController@testimonials', 'as' => 'site.testimonials']);
Route::get('cleanCache','Web\HomeController@cleanCache');

/** ------------------------------------------
 *  Admin Group
 *  ------------------------------------------
 */
Route::group(array('prefix' => 'admin'), function()
{
    Route::get('/','Web\AdminController@index');
    Route::get('impersonate/{users}','Web\AdminController@impersonate');
    Route::post('deploy','Web\AdminController@deploy');
});

/** ------------------------------------------
 *  Auth and User Group
 *  ------------------------------------------
 */
Route::get('@{username}','Web\UserController@profile');
Route::get('profile/{users}','Web\UserController@profile');
Route::get('users','Web\UserController@index');

Route::get('auth/external/{provider}','Auth\AuthController@external');
Route::get('auth/edit','Web\UserController@getFinish');
Route::post('auth/edit','Web\UserController@postFinish');
Route::controllers([
	'auth' => 'Auth\AuthController',
	'password' => 'Auth\PasswordController',
]);

/** ------------------------------------------
 *  Quiz Group
 *  ------------------------------------------
 */
Route::resource('quiz','Web\QuizController');
Route::group(array('prefix' => 'quiz'), function()
{
    Route::get('lam-bai/{slug}/{exams}', ['uses' => 'Web\QuizController@show', 'as' => 'quiz.do']);
    Route::get('ket-qua/{slug}/{id}', 'Web\QuizController@showHistory');
});

/** ------------------------------------------
 *  Video Group
 *  ------------------------------------------
 */
Route::group(array('prefix' => 'video'), function()
{
    Route::get('{slug}/{videos}', ['uses' => 'Web\VideoController@show', 'as' => 'video.show']);
    Route::get('/', ['uses' => 'Web\VideoController@index', 'as' => 'video.index']);
});

/** ------------------------------------------
 *  API V2 Group
 *  ------------------------------------------
 */

Route::group(['prefix' => 'api/v2', 'before' => 'throttle:15,1'], function()
{
    /** ------------------------------------------
     *  Exams
     *  ------------------------------------------
     */
    Route::post('exams/{exams}/check', 'API\ExamV2Controller@check');
    Route::post('exams/{exams}/start', 'API\ExamV2Controller@start');
    Route::get('exams/{exams}/leaderboard','API\ExamV2Controller@leaderboard');
    Route::resource('exams', 'API\ExamV2Controller',[
        'only' => ['index','store','show','update','destroy']
    ]);

    /** ------------------------------------------
     *  Files
     *  ------------------------------------------
     */
    Route::post('files/paste', 'API\UploadV2Controller@paste');
    Route::resource('files','API\UploadV2Controller',[
        'only' => ['store', 'show']
    ]);

    /** ------------------------------------------
     *  Tags
     *  ------------------------------------------
     */
    Route::get('tags/search/{query}', 'API\TagV2Controller@search');
    Route::get('tags/autocomplete/{query}', 'API\TagV2Controller@autoComplete');
    Route::resource('tags','API\TagV2Controller',[
        'only' => ['index','show','update','destroy']
    ]);

    /** ------------------------------------------
     *  Search
     *  ------------------------------------------
     */
    Route::get('search','API\SearchV2Controller@index');

    /** ------------------------------------------
     *  Others
     *  ------------------------------------------
     */
    Route::resource('users','API\UserV2Controller',[
        'only' => ['index','store','show','update','destroy']
    ]);
    Route::resource('roles','API\RoleV2Controller',[
        'only' => ['index','store','show','update','destroy']
    ]);
    Route::resource('permissions','API\PermissionV2Controller',[
        'only' => ['index','store','show','update','destroy']
    ]);
    Route::resource('testimonials','API\TestimonialV2Controller',[
        'only' => ['index','store','show','update','destroy']
    ]);
    Route::resource('videos','API\VideoV2Controller',[
        'only' => ['index','store','show','update','destroy']
    ]);

});

/** ------------------------------------------
 *  Tag Group
 *  ------------------------------------------
 */
Route::get('tag', 'Web\TagController@index');
Route::get('tag/{slug}', 'Web\TagController@show');

/** ------------------------------------------
 *  Rescources Group
 *  ------------------------------------------
 */
Route::get('files/user/{users}/avatar.jpg','Web\ResourcesController@userAvatar');
Route::get('files/image/{size}/{file}','Web\ResourcesController@image');
Route::get('files/pdf/{file}','Web\ResourcesController@pdf');

/** ------------------------------------------
 *  Sitemap
 *  ------------------------------------------
 */
Route::get('{sitemap}.xml','Site\SitemapController@index');

Route::get('test','TestController@index');

// Redirect old url
Route::get('quiz/t/{slug}','Site\RedirectController@quiz');
Route::get('quiz/c/{slug}','Site\RedirectController@category');
Route::get('user/profile/{user}','Site\RedirectController@userProfile');