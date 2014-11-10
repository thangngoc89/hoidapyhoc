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
     * @param mixed $isEmailOnError
     */
    public function setIsEmailOnError($isEmailOnError)
    {
        $this->isEmailOnError = $isEmailOnError;
    }
    protected $secretKey;
    protected $repository;
    protected $branchMap; //map branch to directory
    protected $authorMap; //map author to directory
    protected $exclude;
    protected $tmpDir;
    protected $isNeedClearUp;
    protected $backupDir;
    protected $isUseComposer;
    protected $isEmailOnError;
    protected $notifyEmail;

    function __construct($params = array())
    {
        $this->secretKey = $params["secretKey"];
        $this->repository = $params["repository"];
        $this->branchMap = $params["branchMap"];
        $this->authorMap = $params["authorMap"];
        $this->exclude = $params["exclude"];
        $this->tmpDir = $params["tmpDir"];
        $this->isNeedClearUp = $params["isNeedClearUp"];
        $this->backupDir = $params["backupDir"];
        $this->isUseComposer = $params["isUseComposer"];
        $this->isEmailOnError = $params["isEmailOnError"];
        $this->checkEnvironment();
    }
    public function checkEnvironment(){
        $commander = Commander::getInstance();
        var_dump($commander->execute("which git"));
    }
    public static function  buildCommand(){

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
    public function getIsUseCOmposer()
    {
        return $this->isUseComposer;
    }

    /**
     * @param mixed $isUseComposer
     */
    public function setIsUseCOmposer($isUseComposer)
    {
        $this->isUseComposer = $isUseComposer;
    }

    /**
     * @return mixed
     */
    public function getIsEmailOnError()
    {
        return $this->isEmailOnError;
    }

}