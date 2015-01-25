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

get('/','HomeController@index');
get('thongke','HomeController@stat');
get('cleanCache','HomeController@cleanCache');

get('@{username}','UserController@profile');

get('auth/external/{provider}','Auth\AuthController@external');

get('auth/edit','UserController@getFinish');
post('auth/edit','UserController@postFinish');

Route::controllers([
	'auth' => 'Auth\AuthController',
	'password' => 'Auth\PasswordController',
    'user' => 'UserController',
]);


Route::group(array('prefix' => 'quiz'), function()
{
    Route::get('lam-bai/{slug?}/{id?}', 'QuizController@show');
    Route::get('ket-qua/{slug}/{id}', 'QuizController@showHistory');

    get('create','QuizController@create');
    Route::get('/{filter?}/{info?}', 'QuizController@index');

});



Route::group(array('prefix' => 'api/v2'), function()
{
    get('tests/{id}/pull', 'API\TestV2Controller@pullPicture');
    post('tests/{id}/check', 'API\TestV2Controller@check');
    post('tests/{id}/start', 'API\TestV2Controller@start');
    post('tests/upload/', 'API\TestV2Controller@upload');

    Route::resource('files','API\UploadV2Controller');
    Route::resource('tests', 'API\TestV2Controller');
});

