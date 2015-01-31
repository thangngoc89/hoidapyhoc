<?php

return array(

    /*
    |--------------------------------------------------------------------------
    | Name of route
    |--------------------------------------------------------------------------
    |
    | Enter the routes name to enable dynamic imagecache manipulation.
    | This handle will define the first part of the URI:
    | 
    | {route}/{template}/{filename}
    | 
    | Examples: "images", "img/cache"
    |
    */
   
    'route' => 'files/image',

    /*
    |--------------------------------------------------------------------------
    | Storage paths
    |--------------------------------------------------------------------------
    |
    | The following paths will be searched for the image filename, submited 
    | by URI. 
    | 
    | Define as many directories as you like.
    |
    */
    
    'paths' => array(
        public_path('uploads'),
        'http://media.hoidapyhoc.com/'
    ),

    /*
    |--------------------------------------------------------------------------
    | Manipulation templates
    |--------------------------------------------------------------------------
    |
    | Here you may specify your own manipulation callbacks.
    | The keys of this array will define which templates 
    | are available in the URI:
    |
    | {route}/{template}/{filename}
    |
    */
   
    'templates' => array(

        'big' => function($image) {
            return $image->resize(1500 , null, function ($constraint) {
                $constraint->aspectRatio();
            })->encode('jpg', 90);
        },
        'medium' => function($image) {
            return $image->resize(900, null, function ($constraint) {
                $constraint->aspectRatio();
            })->encode('jpg', 90);
        },
        'small' => function($image) {
            return $image->resize(600, null, function ($constraint) {
                $constraint->aspectRatio();
            })->encode('jpg', 90);
        },
        'thumb' => function($image) {
            return $image->resize(300, null, function ($constraint) {
                $constraint->aspectRatio();
            })->encode('jpg', 90);
        }

    ),

    /*
    |--------------------------------------------------------------------------
    | Image Cache Lifetime
    |--------------------------------------------------------------------------
    |
    | Lifetime in minutes of the images handled by the imagecache route.
    |
    */
   
    'lifetime' => 43200,

);
