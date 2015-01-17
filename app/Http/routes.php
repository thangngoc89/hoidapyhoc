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

get('/','HomeController@index');
get('thongke','HomeController@stat');

get('@{username}','UserController@profile');

Route::get('auth/external/{provider}','Auth\AuthController@external');
Route::controllers([
	'auth' => 'Auth\AuthController',
	'password' => 'Auth\PasswordController',
    'user' => 'UserController',
]);

Route::group(array('prefix' => 'quiz'), function()
{
    Route::get('{slug}/{id}', 'QuizController@show');
    Route::get('ket-qua/{slug}/{id}', 'QuizController@showHistory');
    Route::get('/{filter?}/{info?}', 'QuizController@index');

    Route::get('/create', array('before' => 'auth', 'uses' => 'QuizController@create'));
    Route::get('/edit/{id}', array('before' => 'auth', 'uses' => 'QuizController@edit'));

});

Route::group(array('prefix' => 'api/v2'), function()
{
    post('tests/{id}/check', 'API\TestV2Controller@check');
    Route::resource('tests', 'API\TestV2Controller');
});

