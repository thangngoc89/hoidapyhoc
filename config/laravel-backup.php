<?php

return [

    'source' => [

        'files' => [

            /*
             * The list of directories that should be part of the backup. You can
             * specify individual files as well.
             */
            'include' => [
                storage_path('app/uploads')
            ],

            /*
             * These directories will be excluded from the backup.
             * You can specify individual files as well.
             */
            'exclude' => [
                //
            ],
        ],

        /*
         * Should the database be part of the back up.
         */
        'backup-db' => true,
    ],

    'destination' => [

        /*
         * The filesystem(s) you on which the backups will be stored. Choose one or more
         * of the filesystems you configured in app/config/filesystems.php
         */
        'filesystem' => ['s3-backup'],

        /*
         * The path where the backups will be saved. This path
         * is relative to the root you configured on your chosen
         * filesystem(s).
         *
         * If you're using the local filesystem a .gitignore file will
         * be automatically placed in this directory so you don't
         * accidentally end up committing these backups.
         */
        'path' => 'backups',
    ],

    /*
     * The path to the mysqldump binary. You can leave this empty
     * if the binary is installed in the default location.
     */
    'mysql' => [
        'dump_command_path' => '',
    ],
];
