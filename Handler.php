<?php
require_once "Util/Commander.php";
require_once "AutoGitPull.php";
use AutoGitPuller\AutoGitPull;
define("PARENT_DIR", dirname(__FILE__)."/data");
$default = array(
    "secretKey" => "mysecretkey",
    "repository"=>"",
    "branchMap" => array(
        "master" =>PARENT_DIR."/master"
    ),
    "authorMap" =>array(
        "nguyenvanduocit"=>"."
    ),
    "exclude" => array(),
    "tmpDir" => PARENT_DIR."/reponsive",
    "isNeedClearUp" => false,
    "backupDir" => PARENT_DIR."/backup",
    "isUseComposer" => false,
    "isEmailOnError" => true,
    "notifyEmail" => "nguyenvanduocit@gmail.com"
);
$args = array();
$args = array_merge($default, $args);
$autoGitPull = new AutoGitPull($args);