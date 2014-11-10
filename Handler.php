<?php
require_once "Util/Commander.php";
require_once "Util/Error.php";
require_once "Server/BaseEvent.php";
require_once "Server/Github/Event.php";
require_once "Server/Bitbucket/Event.php";
require_once "AutoGitPull.php";

use AutoGitPuller\AutoGitPull;
define("PARENT_DIR", dirname(__FILE__)."/data");
$default = array(
    "secretKey" => '',
    "repository"=>'',
    "branchMap" => array(
        "master" =>PARENT_DIR."/master",
    ),
    "authorMap" =>array(
        "nguyenvanduocit"=>".",
    ),
    "exclude" => array(),
    "tmpDir" => PARENT_DIR."/tmp",
    "isNeedClearUp" => false,
    "backupDir" => '',
    "isUseComposer" => false,
    "isEmailOnError" => true,
    "isTryMkDir" => true,
    "notifyEmail" => "nguyenvanduasasdfasdfdfocit@gmail.com"
);
$args = array();
$args = array_merge($default, $args);
$autoGitPull = new AutoGitPull($args);