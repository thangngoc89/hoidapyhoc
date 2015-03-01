<?php

return [

    'normalizer'    => '\Quiz\lib\Helpers\Str::slug',
    'displayer'     => '\Illuminate\Support\Str::title',
    'rules'          => [
        'name'  => 'required|alpha_dash|min:2'
    ],

    /*
     * Maximum tags per item
     */
    'maxTag'        => 5,
];