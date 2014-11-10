<?php

/**
 * Project : simple-php-git-deploy
 * User: thuytien
 * Date: 11/10/2014
 * Time: 12:15 AM
 */

namespace AutoGitPuller;

use AutoGitPuller\Util\Commander;

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
    protected $commander;
    function __construct($params = array())
    {
        $default = array(
            "secretKey"=>"",
            "repository"=>"",
            "branchMap"=>array(), //id=>dir
            "authorMap"=>array(),
            "exclude"=>array(),
            "tmpDir"=>"",
            "isNeedClearUp"=>false,
            "backupDir"=>"",
            "isUseComposer"=>false,
        );
        $this->secretKey = $params["secretKey"];
        $this->repository = $params["repository"];
        $this->branchMap = $params["branchMap"];
        $this->authorMap = $params["authorMap"];
        $this->exclude = $params["exclude"];
        $this->tmpDir = $params["tmpDir"];
        $this->isNeedClearUp = $params["isNeedClearUp"];
        $this->backupDir = $params["backupDir"];
        $this->isUseComposer = $params["isUseComposer"];
        $this->emailOnError = $params["emailOnError"];
        $this->commander = Commander::getInstance();
        $checkResult = $this->checkEnvironment();
        if($checkResult["error"]){
            echo $checkResult["message"];
        }
        echo $this->commander->getOutput();
    }
    public function checkEnvironment(){
        $result = array(
            "error" => false
        );
        $commander = Commander::getInstance();
        //try to make dir
        $commander->execute("mkdir %1$",$this->backupDir);
        $commander->execute("mkdir %1$",$this->tmpDir);
        //check backup dir
        if ( ($this->backupDir!='') &&  (!is_dir($this->backupDir) || !is_writable($this->backupDir)) ) {
            $result["error"] = true;
            $result["message"] = sprintf('<div class="error">Backup <code>`%s`</code> does not exists or is not writeable.</div>', $this->backupDir);
            return $result;
        }
        //Check tmp dir
        if ( ($this->tmpDir!='') &&  (!is_dir($this->tmpDir) || !is_writable($this->tmpDir)) ) {
            $result["error"] = true;
            $result["message"] = sprintf('<div class="error">Temp dir <code>`%s`</code> does not exists or is not writeable.</div>', $this->tmpDir);
            return $result;
        }
        //check directory
        if($commander->execute("which git")){

        }
    }
    public static function  buildCommand(){

    }

}