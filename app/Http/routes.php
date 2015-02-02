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

/** ------------------------------------------
 *  HomePage Group
 *  ------------------------------------------
 */
get('/','HomeController@index');
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
    Route::get('lam-bai/{slug}/{id}', 'QuizController@show');
    Route::get('bang-diem/{slug}/{id}', 'QuizController@leaderboard');
    Route::get('ket-qua/{slug}/{id}', 'QuizController@showHistory');
});

/** ------------------------------------------
 *  API V2 Group
 *  ------------------------------------------
 */
Route::group(array('prefix' => 'api/v2'), function()
{
    post('exams/{exams}/check', 'API\ExamV2Controller@check');
    post('exams/{exams}/start', 'API\ExamV2Controller@start');

    post('files/paste', 'API\UploadV2Controller@paste');

    Route::resource('files','API\UploadV2Controller');
    Route::resource('exams', 'API\ExamV2Controller');
    Route::resource('search','API\SearchV2Controller');
    Route::resource('users','API\UserV2Controller');
    Route::resource('roles','API\RoleV2Controller');
    Route::resource('permissions','API\PermissionV2Controller');
    Route::resource('tags','API\TagV2Controller');
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
