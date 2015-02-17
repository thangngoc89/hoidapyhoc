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
 *  Route model binding
 *  ------------------------------------------
 */
Route::model('exams', '\Quiz\Models\Exam');
Route::model('quiz', '\Quiz\Models\Exam');
Route::model('user', '\Quiz\Models\User');
// API Part
Route::model('users', '\Quiz\Models\User');
Route::model('roles', '\Quiz\Models\Enstrust\Role');
Route::model('permissions', '\Quiz\Models\Enstrust\Permission');
Route::model('tags', '\Quiz\lib\Tagging\Tag');
Route::model('testimonials', '\Quiz\Models\Testimonial');
Route::model('video', '\Quiz\Models\Video');

/** ------------------------------------------
 *  HomePage Group
 *  ------------------------------------------
 */
get('{home}','HomeController@index')->where('home', '^(|home)$');;
get('thongke','HomeController@stat');
get('cleanCache','HomeController@cleanCache');
get('testimonials','HomeController@testimonials');

get('admin','HomeController@admin');

/** ------------------------------------------
 *  Auth and User Group
 *  ------------------------------------------
 */
get('@{username}','UserController@profile');
get('users','UserController@index');

get('auth/external/{provider}','Auth\AuthController@external');
get('auth/edit','UserController@getFinish');
post('auth/edit','UserController@postFinish');
Route::controllers([
	'auth' => 'Auth\AuthController',
	'password' => 'Auth\PasswordController',
]);

/** ------------------------------------------
 *  Quiz Group
 *  ------------------------------------------
 */
Route::resource('quiz','QuizController');
Route::group(array('prefix' => 'quiz'), function()
{
    Route::get('lam-bai/{slug}/{exams}', 'QuizController@show');

    #TODO: Remove this route
    Route::get('bang-diem/{slug}/{exams}', 'QuizController@leaderBoard');
    Route::get('ket-qua/{slug}/{id}', 'QuizController@showHistory');
});

/** ------------------------------------------
 *  Video Group
 *  ------------------------------------------
 */
Route::group(array('prefix' => 'video'), function()
{
    Route::get('{slug}/{video}', 'VideoController@show');
    Route::get('/', 'VideoController@index');
});

/** ------------------------------------------
 *  API V2 Group
 *  ------------------------------------------
 */
Route::group(array('prefix' => 'api/v2'), function()
{
    /** ------------------------------------------
     *  Exams
     *  ------------------------------------------
     */
    post('exams/{exams}/check', 'API\ExamV2Controller@check');
    post('exams/{exams}/start', 'API\ExamV2Controller@start');
    get('exams/{exams}/leaderboard','API\ExamV2Controller@leaderboard');
    Route::resource('exams', 'API\ExamV2Controller');

    /** ------------------------------------------
     *  Files
     *  ------------------------------------------
     */
    post('files/paste', 'API\UploadV2Controller@paste');
    Route::resource('files','API\UploadV2Controller');

    /** ------------------------------------------
     *  Tags
     *  ------------------------------------------
     */
    get('tags/search/{query}', 'API\TagV2Controller@search');
    Route::resource('tags','API\TagV2Controller');

    /** ------------------------------------------
     *  Others
     *  ------------------------------------------
     */
    Route::resource('search','API\SearchV2Controller');
    Route::resource('users','API\UserV2Controller');
    Route::resource('roles','API\RoleV2Controller');
    Route::resource('permissions','API\PermissionV2Controller');
    Route::resource('testimonials','API\TestimonialV2Controller');

});

/** ------------------------------------------
 *  Tag Group
 *  ------------------------------------------
 */
get('tag', 'TagController@index');
get('tag/{slug}', 'TagController@show');

/** ------------------------------------------
 *  Rescources Group
 *  ------------------------------------------
 */
get('files/user/{user}/avatar.jpg','ResourcesController@userAvatar');
get('files/image/{size}/{file}','ResourcesController@image');
get('files/pdf/{file}','ResourcesController@pdf');

/** ------------------------------------------
 *  Sitemap
 *  ------------------------------------------
 */
get('{sitemap}.xml','SitemapController@index');

get('test','TestController@index');