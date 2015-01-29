<?php namespace Quiz\lib\Helpers;

use Cocur\Slugify\Slugify;

class Str extends \Illuminate\Support\Str {

    public static function slug($string, $separator = '-')
    {
        $slugify = new Slugify();

        return $slugify->slugify($string);
    }
} 