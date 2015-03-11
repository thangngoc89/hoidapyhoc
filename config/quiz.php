<?php

return [

    'upload' => [
        'file_types' => ['image/png','image/gif','image/jpg','image/jpeg'],
        'file_extensions' => ['png','gif','jpg','jpeg'],
        // Max upload size - In BYTES. 1GB = 1073741824 bytes, 10 MB = 10485760, 1 MB = 1048576
        'max_upload_file_size' => 10485760, // Converter - http://www.beesky.com/newsite/bit_byte.htm
    ],

    'service' => [
        'googleAnalytics'  => 'UA-57021343-2',
    ],

    'video' => [
        'icons' => ["binocular","delete-1","key-1","pencil-3","bookmark-3","roller","stationery-1",
            "award-4","award-2","heart-1","star-9","letter-5","id-1","shopping-1",
            "wallet-1","camera-front","camera-graph-2","add-2","check-circle-2","scale","hammer-1",
            "calendar-1","bug-1","plaster","ambulance","hospital-sign-3","rain",
            "rain-lightning","lock-3","bubble-chat-1","contacts-2","cut","arrow-2","globe",
            "arrow-left","arrow-right","arrow-67","arrow-68","check-circle-2-1","clock-2","clock-2-1","bomb",
            "heart-1-1","check-1","check-1-1","television","video-camera-2","cloud","bookmark-1",
            "link-2","profile-1","movie-play-1","magnifying-glass","setting-gears-1","loop-3","box-3","clip-2",
            "phone-3","plane-paper-2","clipboard-1","folder-share-1","wrench","window-3","database","beaker-1",
            "microscope","cards","hand-like-1","hand-like-1-1"],
    ],

    'crawler' => [
        'importIO' => [
            'med_vid_base_url'    => 'http://www.medicalvideos.org/',
            'med_vid_single_data' => '693c3dc8-bdd9-4d88-84cd-e0cdbaa8f30d',
            'med_vid_index_data' => '087d429b-55dc-4236-b2c1-6a25f7bd4482',
        ]
    ]
];