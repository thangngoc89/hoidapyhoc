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
    protected $output = array();
    public static function getInstance()
    {
        static $instance = null;
        if (null === $instance) {
            $instance = new static();
        }

        return $instance;
    }

    /**
     * @param String $command
     */
    public function enqueue($command){
        $this->commands[] = $command;
    }
    public function checkRequirements(){}

    public function execute($command = ''){
        $result = "";
        if($command != '')
        {
            $this->output[$command] = shell_exec($command);
            return $this->output[$command];
        }
        else {
            if(count($this->commands) == 0)
            {
                return "Command queue is null";
            }
            else
            foreach ($this->commands as $command) {
                $tmp = array();
                exec($command . ' 2>&1', $tmp, $return_code); // Execute the command
                $result .= printf('<span class="prompt">$</span> <span class="command">%s</span><div class="output">%s</div>'
                    , htmlentities(trim($command))
                    , htmlentities(trim(implode("\n", $tmp)))
                );
                if ($return_code !== 0) {
                    break;
                }
            }
            $this->commands = array();
        }
        return $result;
    }
    public function getOutput(){
        $html = "<div class='console_result'>";
        foreach($this->output as $command => $result)
        {
            $html .= sprintf('<p><span class="command">%1$s</span> : <span class="result">%2$s</span></p>', $command, $result);
        }
        return $html;
    }
}