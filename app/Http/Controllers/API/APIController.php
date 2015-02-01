<?php namespace Quiz\Http\Controllers\API;


class APIController extends \Quiz\Http\Controllers\Controller {

    protected $query;

    protected $search;

    protected $input;

    public function __construct()
    {

    }

    public function makeResponse($result){
        return response()->json($result)->header('X-Total-Count',$result['meta']['pagination']['total']);
    }

    public function builder($input, $model, $search = array())
    {
        $columnList = \Schema::getColumnListing($model->getTable());

        // Set some share data in class
        $this->search = $search;

        $this->query = $model;

        $this->input = $input;

        // Apply where clause
        $this->whereClause($columnList);

        // Apply API keywords
        $this->parseKeywords();

        return $this->query;
    }

    private function whereClause($columnList)
    {
        foreach ($this->input->all() as $col)
        {
            if (!in_array($col,$columnList)) continue;

            if (!empty($col) and $col != 0)
                $this->query = $this->query->where($col,'like','%'.$col.'%');
        }
    }

    private function parseKeywords()
    {
        $keywords = ['page','q','_sort','_sortDir','per_page'];
        foreach ($keywords as $keyword)
            $this->{$keyword}();
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
    private function _sort()
    {
        if (is_null($this->input->_sort))
            return false;
        $this->query = $this->query->orderBy($this->input->_sort,$this->input->_sortDir);
    }

    private function _sortDir()
    {
        // do nothing
    }

    private function per_page()
    {
        $this->query = $this->query->paginate($this->input->per_page);
    }
}