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

Route::get('/', function(){
    return view('index');
});

Route::get('home', 'HomeController@index');

Route::get('auth/external/{provider}','Auth\AuthController@external');

Route::controllers([
	'auth' => 'Auth\AuthController',
	'password' => 'Auth\PasswordController',
]);

Route::group(array('prefix' => 'quiz'), function()
{
    Route::get('/t/{slug}', 'QuizController@show');
    Route::get('/t/{slug}/ket-qua/{id}', 'QuizController@showHistory');
    Route::get('/{filter?}/{info?}', 'QuizController@index');

    Route::get('/create', array('before' => 'auth', 'uses' => 'QuizController@create'));
    Route::get('/edit/{id}', array('before' => 'auth', 'uses' => 'QuizController@edit'));

});