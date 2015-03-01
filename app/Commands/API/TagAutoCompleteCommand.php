<?php namespace Quiz\Commands\API;

use Quiz\Commands\Command;

class TagAutoCompleteCommand extends Command {
    /**
     * @var
     */
    public $query;

    /**
     * Create a new command instance.
     *
     * @param $query
     * @return \Quiz\Commands\API\TagAutoCompleteCommand
     */
	public function __construct($query)
	{
		//
        $this->query = $query;
    }

}
