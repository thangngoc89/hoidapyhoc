<?php
namespace AutoGitPuller;
require_once "Util/Commander.php";
require_once "AutoGitPull.php";
use AutoGitPuller;

$default = array(
    "secretKey" => "mysecretkey",
    "repository"=>"",
    "branchMap" => array(
        "master" =>"/master/"
    ),
    "authorMap" =>array(
        "nguyenvanduocit"=>"/"
    ),
    "exclude" => array(),
    "tmpDir" => "reponsive",
    "isNeedClearUp" => false,
    "backupDir" => "/backup/",
    "isUseComposer" => false,
    "isEmailOnError" => true,
    "notifyEmail" => "nguyenvanduocit@gmail.com"
);
$args = array();
$args = array_merge($default, $args);
$autoGitPull = new AutoGitPull($args);