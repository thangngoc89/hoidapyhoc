<?php namespace Quiz\Http\Controllers\API;


class APIController extends \Quiz\Http\Controllers\Controller {

    protected $query;

    protected $search;

    protected $input;

    protected $columnList;
    public function makeResponse($result){
        return response()->json($result)->header('X-Total-Count',$result['meta']['pagination']['total']);
    }

    public function builder($input, $model, $search = array())
    {
        $this->setColumnList($model);
        // Set some share data in class
        $this->search = $search;

        $this->query = $model;

        $this->input = $input;

        // Apply where clause
        $this->whereClause();

        // Apply API keywords
        $this->parseKeywords();

        return $this->query;
    }

    private function whereClause()
    {
        foreach ($this->input->all() as $col)
        {
            if (in_array($col, $this->columnList))
            {
                if (!empty($col) and $col != 0)
                    $this->query = $this->query->where($col,$this->input->get($col));
            }
        }
    }

    private function parseKeywords()
    {
        $keywords = ['page','q','_sortField','_sortDir','_perPage'];
        foreach ($keywords as $keyword)
            $this->{$keyword}();
    }

    /**
     * @param mixed $columnList
     */
    public function setColumnList($model)
    {
        $this->columnList = \Schema::getColumnListing($model->getTable());
    }

    private function page()
    {
        // do nothing
    }

    private function q()
    {
        if (empty($this->search))
            return false;

        // Search here with given cloumn
        foreach ($this->search as $col)
        {
            $this->query = $this->query->orWhere($col,'like','%'.$this->input->q.'%');
        }
    }
    private function _sortField()
    {
        // Prevent sort by un exists column cause query error
        if (!in_array($this->input->_sortField, $this->columnList))
            return false;

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
}