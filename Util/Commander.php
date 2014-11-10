<?php
/**
 * Project : simple-php-git-deploy
 * User: thuytien
 * Date: 11/10/2014
 * Time: 12:58 AM
 */

namespace AutoGitPuller\Util;


class Commander {
    protected $commands; //array
    public static function getInstance()
    {
        static $instance = null;
        if (null === $instance) {
            $instance = new static();
        }

        return $instance;
    }
    public function enqueue($command){
        $this->commands[] = $command;
    }
    public function checkRequirements(){}

    public function execute($command = ''){
        $result = "";
        if($command != '')
        {
            return shell_exec($command);
        }
        else {
            if(count($this->commands) == 0)
            {
                return "Command queue is null";
            }
            else
            foreach ($this->commands as $command) {
                $result .= shell_exec($command);
            }
            $this->commands = array();
        }
        return $result;
    }
}