<?php

return [

    'normalizer'    => '\Quiz\lib\Helpers\Str::slug',
    'displayer'     => '\Illuminate\Support\Str::title',
    'rules'          => [
        'name'  => 'required|min:3'
    ],

    /*
     * Maximum tags per item
     */
    'maxTag'        => 5,
];