<?php namespace Quiz\Commands\API;

use Quiz\Commands\Command;
use Illuminate\Http\Request;
use Illuminate\Contracts\Bus\SelfHandling;

class ParseQuery extends Command {
    /**
     * @var Request
     */
    public $request;
    /**
     * @var
     */
    public $model;
    /**
     * @var
     */
    public $search;
    /**
     * @var
     */
    public $eagerLoad;

    /**
     * Create a new command instance.
     *
     * @param Request $request
     * @param $model
     * @param $search
     * @param $eagerLoad
     * @return \Quiz\Commands\API\ParseQuery
     */
	public function __construct(Request $request, $model, $search, $eagerLoad)
	{
        $this->request = $request;
        $this->model = $model;
        $this->search = $search;
        $this->eagerLoad = $eagerLoad;
    }

}
