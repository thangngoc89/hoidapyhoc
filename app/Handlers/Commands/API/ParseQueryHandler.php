<?php namespace Quiz\Handlers\Commands\API;

use Quiz\Commands\API\ParseQuery;
use Illuminate\Queue\InteractsWithQueue;

class ParseQueryHandler {

    protected $query;

    protected $search;

    protected $input;

    protected $columnsList;

	/**
	 * Create the command handler.
	 *
	 * @return void
	 */
	public function __construct()
	{
		//
	}

	/**
	 * Handle the command.
	 *
	 * @param  ParseQuery  $command
	 */
	public function handle(ParseQuery $command)
	{
        $this->setColumnList($command->model);

        // Set some share data in class
        $this->search = $command->search;

        $this->query = $command->model->with($command->eagerLoad);

        $this->input = $command->request;

        // Apply where clause
        $this->whereClause();

        // Apply API keywords
        $this->parseKeywords();

        return $this->query;
	}


    private function whereClause()
    {
        \Log::info('whereClause debug', $this->input->all());

        foreach ($this->input->all() as $col)
        {
            if (in_array($col, $this->columnsList))
            {
                if (!empty($col) and $col != 0)
                    $this->query = $this->query->where($col, '=', $this->input->get($col));
            }
        }
    }

    private function parseKeywords()
    {
        $keywords = ['_filters', 'page', 'q', '_sortField','_sortDir','_perPage'];
        foreach ($keywords as $keyword)
        {
            $this->{$keyword}();
        }
    }

    /**
     * @param mixed $columnList
     * return void
     */
    public function setColumnList($model)
    {
        #TODO: Move all models into repository and use cache for this method

        $table = $model->getTable();

        $this->columnsList = \Schema::getColumnListing($table);
    }

    private function page()
    {
        // do nothing
    }

    private function q()
    {
        if (empty($this->search))
            return;

        if (empty($this->input->q))
            return;
        // Search here with given cloumn
        foreach ($this->search as $col)
        {
            $this->query = $this->query->orWhere($col,'like','%'.$this->input->q.'%');
        }
    }
    private function _sortField()
    {
        // Prevent sort by un exists column cause query error
        if (!in_array($this->input->_sortField, $this->columnsList))
            return;

        $this->query = $this->query->orderBy($this->input->_sortField,$this->input->_sortDir);
    }

    private function _sortDir()
    {
        // do nothing
    }

    private function _perPage()
    {
        $this->query = $this->query->paginate($this->input->_perPage);
    }

    private function _filters()
    {
        $filters = json_decode($this->input->_filters);

        if (is_null($filters))
            return;

        if ($filters->id)
            $this->query = $this->query->whereIn('id',$filters->id);
    }

}
