<?php

return [

    'normalizer'    => '\Quiz\lib\Helpers\Str::slug',
    'displayer'     => '\Illuminate\Support\Str::title',

    /*
     * Maximum tags per item
     */
    'maxTag'        => 3,
];