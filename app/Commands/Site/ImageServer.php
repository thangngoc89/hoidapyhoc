<?php namespace Quiz\Commands\Site;

use Quiz\Commands\Command;

class ImageServer extends Command {
    /**
     * @var
     */
    public $path;
    /**
     * @var
     */
    public $size;

    /**
     * Create a new command instance.
     *
     * @param $size
     * @param $path
     * @return \Quiz\Commands\Site\ImageServer
     */
	public function __construct($size, $path)
	{
        $this->path = $path;
        $this->size = $size;
    }

}
