<?php

return [

    'upload' => [
        'file_types' => ['image/png','image/gif','image/jpg','image/jpeg'],
        'file_extensions' => ['png','gif','jpg','jpeg'],
        // Max upload size - In BYTES. 1GB = 1073741824 bytes, 10 MB = 10485760, 1 MB = 1048576
        'max_upload_file_size' => 10485760, // Converter - http://www.beesky.com/newsite/bit_byte.htm
    ],
];