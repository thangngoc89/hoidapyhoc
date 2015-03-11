<?php

return [

	/*
	|--------------------------------------------------------------------------
	| Third Party Services
	|--------------------------------------------------------------------------
	|
	| This file is for storing the credentials for third party services such
	| as Stripe, Mailgun, Mandrill, and others. This file provides a sane
	| default location for this type of information, allowing packages
	| to have a conventional place to find your various credentials.
	|
	*/

	'mailgun' => [
		'domain' => '',
		'secret' => '',
	],

	'mandrill' => [
		'secret' => '',
	],

	'ses' => [
		'key' => '',
		'secret' => '',
		'region' => 'us-east-1',
	],

	'stripe' => [
		'model'  => 'User',
		'secret' => '',
	],
    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => 'http://'.env('HOST_NAME').'/auth/external/google'
    ],

    'facebook' => [
        'client_id' => env('FACEBOOK_CLIENT_ID'),
        'client_secret' => env('FACEBOOK_CLIENT_SECRET'),
        'redirect' => 'http://'.env('HOST_NAME').'/auth/external/facebook'
    ],

    'flickr' => [
        'client_id' => 'a84b8e83825245304cac128ce9811ca5',
        'client_secret' => 'bb38d596ba93acc5',
    ],

    'slack' => [
        'api_key' => env('SLACK_API_KEY'),
        'channel' => env('SLACK_CHANNEL'),
    ],

    'bitly' => [
        'access_token' => env('BITLY_ACCESS_TOKEN')
    ],

    'importIo' => [
        'api_key' => env('IMPORT_IO_API_KEY'),
    ],

];
