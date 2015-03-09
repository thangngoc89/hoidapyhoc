<?php

use Quiz\lib\Helpers\Str;

if ( ! function_exists('random_video_icon'))
{
    function random_video_icon()
    {
        return Str::random_video_icon();
    }
}