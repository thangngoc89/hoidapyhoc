<?php namespace Quiz\lib\Helpers;

use Cocur\Slugify\Slugify;
use Illuminate\Support\Collection;

class Str extends \Illuminate\Support\Str {

    public static function slug($string, $separator = '-')
    {
        $slugify = new Slugify();

        return $slugify->slugify($string);
    }

    public static function base64ImageParser($string)
    {
        // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAssAAACzC
        $parse = preg_split("/[\:;,\?]+/",$string);
        //Remove data keyword

        $data = [
            'extension' => Str::extensionFromMimeType($parse[1]),
            'mimetype'  => $parse[1],
            'data'      => base64_decode($parse[3])
        ];

        return $data;
    }

    public static function extensionFromMimeType($string)
    {
        return explode('/', $string)[1];
    }
} 