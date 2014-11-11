<?php
/**
 * Project : simple-php-git-deploy
 * User: thuytien
 * Date: 11/10/2014
 * Time: 9:28 PM
 */

namespace AutoGitPuller\Util;


class Logger {
    public static function logStart()
    {
        ob_start();
    }
    public static function logEnd(){
        $result = ob_get_contents();
        file_put_contents(PARENT_DIR."/log.html",$result);
        ob_end_clean();
    }
}