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
Route::model('tests', '\Quiz\Models\Exam');
Route::model('quiz', '\Quiz\Models\Exam');

/** ------------------------------------------
 *  HomePage Group
 *  ------------------------------------------
 */
get('/','HomeController@index');
get('thongke','HomeController@stat');
get('cleanCache','HomeController@cleanCache');
get('testimonials','HomeController@testimonials');

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
    Route::get('lam-bai/{slug}/{tests}', 'QuizController@show');
    Route::get('bang-diem/{slug}/{tests}', 'QuizController@leaderboard');
    Route::get('ket-qua/{slug}/{id}', 'QuizController@showHistory');
});

/** ------------------------------------------
 *  API V2 Group
 *  ------------------------------------------
 */
Route::group(array('prefix' => 'api/v2'), function()
{
    post('tests/{tests}/check', 'API\TestV2Controller@check');
    post('tests/{tests}/start', 'API\TestV2Controller@start');
    post('files/paste', 'API\UploadV2Controller@paste');

    Route::resource('files','API\UploadV2Controller');
    Route::resource('tests', 'API\TestV2Controller');
    Route::resource('search','API\SearchV2Controller');
});

/** ------------------------------------------
 *  Tag Group
 *  ------------------------------------------
 */
get('tag', 'TagController@index');
get('tag/{slug}', 'TagController@show');

