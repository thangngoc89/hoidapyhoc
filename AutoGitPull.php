<?php

/**
 * Project : simple-php-git-deploy
 * User: thuytien
 * Date: 11/10/2014
 * Time: 12:15 AM
 */

namespace AutoGitPuller;

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
     * @param mixed $emailOn \AutoGitPuller\Util\Error
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
     * @param mixed $isEmailOn \AutoGitPuller\Util\Error
     */
    protected $secretKey;
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
    protected $repositoryName;
    protected $username;
    protected $password;
    protected $event;

    /**
     * @return mixed
     */
    public function getRepositoryName()
    {
        return $this->repositoryName;
    }

    /**
     * @param mixed $repository
     */
    public function setRepositoryName($repository)
    {
        $this->repositoryName = $repository;
    }

    function __construct($args = array())
    {
        //init properties
        $this->init($args);

        $this->event = $this->handleRequest();

        if ($this->event instanceof \AutoGitPuller\Util\Error) {
            die($this->event->getMessage());
        }

        $this->commander = \AutoGitPuller\Util\Commander::getInstance();

        $checkResult = $this->checkEnvironment();

        if ($checkResult instanceof \AutoGitPuller\Util\Error) {
            die($checkResult->getMessage());
        }

        $pullResult = $this->doPull();

        echo $this->commander->getOutput();
    }

    protected function init($args = array())
    {
        $default = array(
            "secretKey" => '',
            "repository" => '',
            "branchMap" => array(), //id=>dir
            "authorMap" => array(),
            "exclude" => array(),
            "tmpDir" => '',
            "isNeedClearUp" => false,
            "backupDir" => '',
            "isTryMkDir" => true,
            "isUseComposer" => false,
            "username"=>'',
            'password' =>''
        );
        $args = array_merge($default, $args);
        $this->secretKey = $args["secretKey"];
        $this->repositoryName = $args["repository"];
        $this->branchMap = $args["branchMap"];
        $this->authorMap = $args["authorMap"];
        $this->exclude = $args["exclude"];
        $this->tmpDir = $args["tmpDir"];
        $this->isNeedClearUp = $args["isNeedClearUp"];
        $this->backupDir = $args["backupDir"];
        $this->isUseComposer = $args["isUseComposer"];
        $this->emailOnError = $args["emailOnError"];
        $this->isTryMkDir = $args["isTryMkDir"];
        $this->username = $args["username"];
        $this->password = $args["password"];
    }

    public function checkEnvironment()
    {
        $result = array(
            "error" => false
        );
        if ($this->isTryMkDir) {
            //try to make dir
            if ( ($this->backupDir !== '') && (!is_dir($this->backupDir)) ) {
                $this->commander->execute(sprintf('mkdir -p %1$s', $this->backupDir));
            }
            if ( ($this->tmpDir !== '') && (!is_dir($this->tmpDir)) ) {
                $this->commander->execute(sprintf('mkdir -p %1$s', $this->tmpDir));
            }
            //try to create dir
            foreach ($this->branchMap as $branch => $dir) {
                if (($dir !== '') && !is_dir($dir)) {
                    $this->commander->execute(sprintf('mkdir -p %1$s', $dir));
                }
                foreach($this->authorMap as $author => $authorDir)
                {
                    $authorDirPath =  $dir."/".$authorDir;
                    if (($authorDirPath !== '') && !is_dir($authorDirPath)) {
                        $this->commander->execute(sprintf('mkdir -p %1$s', $authorDirPath));
                    }
                }
            }
        }
        //Check if dir exist and write able
        foreach ($this->branchMap as $branch => $dir) {
            if (!is_dir($dir) || !is_writable($dir)) {
                return new \AutoGitPuller\Util\Error("", sprintf('Branch dir:  <code>`%s`</code> does not exists or is not writeable.', $dir));
            }
            foreach($this->authorMap as $author => $authorDir)
            {
                $authorDirPath =  $dir."/".$authorDir;
                if (($authorDirPath !== '') && !is_dir($authorDirPath)) {
                    return new Error("", sprintf('Author dir:  <code>`%s`</code> does not exists or is not writeable.', $dir));
                }
            }
        }
        //check backup dir
        if (($this->backupDir != '') && (!is_dir($this->backupDir) || !is_writable($this->backupDir))) {
            return new \AutoGitPuller\Util\Error("", sprintf('Backup <code>`%s`</code> does not exists or is not writeable.', $this->backupDir));
        }
        //Check tmp dir
        if (($this->tmpDir != '') && (!is_dir($this->tmpDir) || !is_writable($this->tmpDir))) {
            return new \AutoGitPuller\Util\Error("", sprintf('Temp dir <code>`%s`</code> does not exists or is not writeable.', $this->tmpDir));
        }
        //check directory
        if ($this->commander->execute("which git") == '') {
            return new \AutoGitPuller\Util\Error("", "GIT is not installed.");
        }
        //only use rsync when have tmp dir
        if ($this->tmpDir !== '') {
            if ($this->commander->execute("which rsync") == '') {
                return new \AutoGitPuller\Util\Error("", "rsync is not installed.");
            }
        }
        //only user tar when backup
        if ($this->backupDir !== '') {
            if ($this->commander->execute("which tar") == '') {
                return new \AutoGitPuller\Util\Error("", "tar is not installed.");
            }
        }
        //only use composer when...
        if ($this->isUseComposer) {
            if($this->commander->execute("which composer --no-ansi") == '') {
                return new \AutoGitPuller\Util\Error("", "composer is not installed.");
            }
        }
    }
    //handle and processing postdata from git
    public function handleRequest()
    {
        $headerString = "";

        $eventHandler = new \AutoGitPuller\Server\Github\Event($this->secretKey);
        $isValidatedRequest = $eventHandler->processRequest();

        if ($isValidatedRequest instanceof \AutoGitPuller\Util\Error) {
            return $isValidatedRequest;
        }
        //check if commiter id is map with dir
        if ($this->authorMap[$eventHandler->getCommiterUsername()] !== '') {
            if ($this->branchMap[$eventHandler->getRepositoryBranch()] !== '') {
                return $eventHandler;
            } else {
                return new Error("", "Branch is not allowed");
            }
        } else {
            return new Error("", "This commiter is now allowed");
        }
    }
    //build git command
    private function doPull()
    {
        if($this->tmpDir !=='')
        {
            $this->commander->enqueue(sprintf(
                'git clone --depth=1 --branch %s %s %s'
                , $this->event->getRepositoryBranch()
                , $this->event->getRepositoryGitURL()
                , $this->tmpDir
            ));
            file_put_contents(dirname(__FILE__)."/data.txt",sprintf(
                'git clone --depth=1 --branch %s %s %s'
                , $this->event->getRepositoryBranch()
                , $this->event->getRepositoryGitURL()
                , $this->tmpDir
            ));
        }
        else
        {

        }
    }

}