<?php

/**
 * Project : simple-php-git-deploy
 * User: thuytien
 * Date: 11/10/2014
 * Time: 12:15 AM
 */

namespace AutoGitPuller;

use AutoGitPuller\Util\Commander;
use AutoGitPuller\Util\Error;

class AutoGitPull
{
    /**
     * @return mixed
     */
    public function getIsNeedClearUp()
    {
        return $this->isNeedClearUp;
    }

    /**
     * @param mixed $isNeedClearUp
     */
    public function setIsNeedClearUp($isNeedClearUp)
    {
        $this->isNeedClearUp = $isNeedClearUp;
    }

    /**
     * @return mixed
     */
    public function getSecretKey()
    {
        return $this->secretKey;
    }

    /**
     * @param mixed $secretKey
     */
    public function setSecretKey($secretKey)
    {
        $this->secretKey = $secretKey;
    }

    /**
     * @return mixed
     */
    public function getRepository()
    {
        return $this->repository;
    }

    /**
     * @param mixed $repository
     */
    public function setRepository($repository)
    {
        $this->repository = $repository;
    }

    /**
     * @return mixed
     */
    public function getBranchMap()
    {
        return $this->branchMap;
    }

    /**
     * @param mixed $branchMap
     */
    public function setBranchMap($branchMap)
    {
        $this->branchMap = $branchMap;
    }

    /**
     * @return mixed
     */
    public function getAuthorMap()
    {
        return $this->authorMap;
    }

    /**
     * @param mixed $authorMap
     */
    public function setAuthorMap($authorMap)
    {
        $this->authorMap = $authorMap;
    }

    /**
     * @return mixed
     */
    public function getExclude()
    {
        return $this->exclude;
    }

    /**
     * @param mixed $exclude
     */
    public function setExclude($exclude)
    {
        $this->exclude = $exclude;
    }

    /**
     * @return mixed
     */
    public function getTmpDir()
    {
        return $this->tmpDir;
    }

    /**
     * @param mixed $tmpDir
     */
    public function setTmpDir($tmpDir)
    {
        $this->tmpDir = $tmpDir;
    }

    /**
     * @return mixed
     */
    public function getBackupDir()
    {
        return $this->backupDir;
    }

    /**
     * @param mixed $backupDir
     */
    public function setBackupDir($backupDir)
    {
        $this->backupDir = $backupDir;
    }

    /**
     * @return mixed
     */
    public function getIsUseComposer()
    {
        return $this->isUseComposer;
    }

    /**
     * @param mixed $isUseComposer
     */
    public function setIsUseComposer($isUseComposer)
    {
        $this->isUseComposer = $isUseComposer;
    }

    /**
     * @return mixed
     */
    public function getEmailOnError()
    {
        return $this->emailOnError;
    }

    /**
     * @param mixed $emailOnError
     */
    public function setEmailOnError($emailOnError)
    {
        $this->emailOnError = $emailOnError;
    }

    /**
     * @return mixed
     */
    public function getNotifyEmail()
    {
        return $this->notifyEmail;
    }

    /**
     * @param mixed $notifyEmail
     */
    public function setNotifyEmail($notifyEmail)
    {
        $this->notifyEmail = $notifyEmail;
    }

    /**
     * @param mixed $isEmailOnError
     */
    protected $secretKey;
    protected $repository;
    protected $branchMap; //map branch to directory
    protected $authorMap; //map author to directory
    protected $exclude;
    protected $tmpDir;
    protected $isNeedClearUp;
    protected $backupDir;
    protected $isUseComposer;
    protected $emailOnError;
    protected $notifyEmail;
    protected $log;
    protected $isTryMkDir;
    protected $commander;

    function __construct($args = array())
    {
        $default = array(
            "secretKey" => "",
            "repository" => "",
            "branchMap" => array(), //id=>dir
            "authorMap" => array(),
            "exclude" => array(),
            "tmpDir" => "",
            "isNeedClearUp" => false,
            "backupDir" => "",
            "isTryMkDir" => true,
            "isUseComposer" => false,
        );
        $args = array_merge($default,$args);
        $this->secretKey = $args["secretKey"];
        $this->repository = $args["repository"];
        $this->branchMap = $args["branchMap"];
        $this->authorMap = $args["authorMap"];
        $this->exclude = $args["exclude"];
        $this->tmpDir = $args["tmpDir"];
        $this->isNeedClearUp = $args["isNeedClearUp"];
        $this->backupDir = $args["backupDir"];
        $this->isUseComposer = $args["isUseComposer"];
        $this->emailOnError = $args["emailOnError"];
        $this->isTryMkDir = $args["isTryMkDir"];

        $this->commander = Commander::getInstance();

        $this->handleRequest();

        $checkResult = $this->checkEnvironment();

        if($checkResult instanceof Error)
        {
            die($checkResult->getMessage());
        }

        echo $this->commander->getOutput();
    }

    public function checkEnvironment()
    {
        $result = array(
            "error" => false
        );
        if($this->isTryMkDir) {
            //try to make dir
            if($this->backupDir !== '') {
                $this->commander->execute(sprintf('mkdir -p %1$s', $this->backupDir));
            }
            if($this->tmpDir !== '') {
                $this->commander->execute(sprintf('mkdir -p %1$s', $this->tmpDir));
            }
            foreach($this->branchMap as $branch => $dir)
            {
                if( ($dir !=='') && !is_dir($dir)){
                    $this->commander->execute(sprintf('mkdir -p %1$s', $dir));
                }
            }
        }
        foreach($this->branchMap as $branch => $dir)
        {
            if(!is_dir($dir) || !is_writable($dir)){
                return new Error("",sprintf('Branch dir:  <code>`%s`</code> does not exists or is not writeable.', $dir));
            }
        }
        //check backup dir
        if (($this->backupDir != '') && (!is_dir($this->backupDir) || !is_writable($this->backupDir))) {
            return new Error("",sprintf('Backup <code>`%s`</code> does not exists or is not writeable.', $this->backupDir));
        }
        //Check tmp dir
        if (($this->tmpDir != '') && (!is_dir($this->tmpDir) || !is_writable($this->tmpDir))) {
            return new Error("",sprintf('Temp dir <code>`%s`</code> does not exists or is not writeable.', $this->tmpDir));
        }
        //check directory
        if ($this->commander->execute("which git") == '') {
            return new Error("","GIT is not installed.");
        }
        if($this->tmpDir !== '') {
            if ($this->commander->execute("which rsync") == '') {
                return new Error("","rsync is not installed.");
            }
        }
        if($this->backupDir !== '') {
            if ($this->commander->execute("which tar") == '') {
                return new Error("", "tar is not installed.");
            }
        }
        if ($this->isUseComposer && $this->commander->execute("which composer --no-ansi") == '') {
            return new Error("", "composer is not installed.");
        }
    }
    public function handleRequest(){
        $headerArr = getallheaders();
        $headerString = "";
        foreach($headerArr as $key => $value)
        {
            $headerString .= $key.":".$value ."\n";
        }
        file_put_contents(dirname(__FILE__)."/data.txt", $headerString);
        //if(){}
        if($headerArr['X-Github-Event'] !== 'push'){
            return new Error("","Event is not push");
        }
    }
    public function process(){

    }

}