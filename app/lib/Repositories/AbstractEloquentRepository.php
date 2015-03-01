<?php namespace Quiz\lib\Repositories;

abstract class AbstractEloquentRepository {

    #TODO: Add more keyword here
    protected static $whereKeyword = ['=','between','like','>','<'];

    public function all()
    {
        return $this->model->all();
    }

    public function find($id)
    {
        return $this->model->find($id);
    }

    public function findOrFail($id)
    {
        $entity = $this->find($id);
        if (is_null($entity))
            return abort(404);
        return $entity;
    }

    public function firstOrNew($array)
    {
        return $this->model->firstOrNew($array);
    }

    public function firstOrCreate($array)
    {
        return $this->model->firstOrCreate($array);
    }

    public function where($key, $method, $value = null)
    {
        if ($value == null && in_array($method, static::$whereKeyword))
        {
            return $this->model->where($key, '=', $method);
        }
        return $this->model->where($key, $method, $value);
    }

    public function whereIn($key, $array)
    {
        return $this->model->whereIn($key, $array);
    }

    public function whereRaw($query, $variables = null)
    {
        return $this->model->whereRaw($query, $variables);
    }

    public function orWhere($key, $value)
    {
        return $this->model->orWhere($key, $value);
    }

    public function search($query, $divided = 4)
    {
        return $this->model->search($query, $divided);
    }

    public function fill($input)
    {
        return $this->model->fill($input);
    }
    /**
     * Create new entity with input
     * @param $input
     * @return mixed
     */
    public function create($input)
    {
        return $this->model->create($input);
    }

    /**
     * Mass Assignment Update entity
     * @param $input
     * @return mixed
     */
    public function update($input)
    {
        return $this->model->update($input);
    }

    /**
     * Order entity by column and direction
     * @param $column
     * @param $direction
     * @return mixed
     */
    public function orderBy($column, $direction = 'ASC')
    {
        return $this->model->orderBy($column, $direction);
    }

    public function orderByRaw($query)
    {
        return $this->model->orderBy($query);
    }


    public function latest()
    {
        return $this->model->latest();
    }

    public function sortByDesc($callback)
    {
        return $this->model->sortByDesc($callback);
    }

    /**
     * Eager Load of instance
     *
     * @param array $with
     * @return mixed
     */
    public function with($with)
    {
        return $this->model->with($with);
    }

    public function load($relationship)
    {

        return $this->model->load($relationship);
    }

    /**
     * Find a single entity by key value
     *
     * @param string $key
     * @param string $value
     * @param array $with
     */
    public function getFirstBy($key, $value, array $with = array())
    {
        return $this->with($with)->where($key, '=', $value)->first();
    }

    /**
     * Find many entities by key value
     *
     * @param string $key
     * @param string $value
     * @param array $with
     */
    public function getManyBy($key, $value, array $with = array())
    {
        return $this->with($with)->where($key, '=', $value)->get();
    }

    /**
     * Return all results that have a required relationship
     *
     * @param string $relation
     */
    public function has($relation)
    {
        return $this->model->has($relation);
    }

    public function get($array = array())
    {
        return $this->model->get($array = array());
    }

    public function paginate($number)
    {
        return $this->model->paginate($number);
    }

    public function first()
    {
        return $this->model->first();
    }


    public function count()
    {
        return $this->model->count();
    }

    public function getTable()
    {
        return $this->model->getTable();
    }


    /*
     * Tagging Area
     */

    public function tag($string)
    {
        return $this->model->tag($string);
    }

    public function untag($string)
    {
        return $this->model->untag($string);
    }

    public function retag($array)
    {
        return $this->model->retag($array);

    }

    public function tagged()
    {
        return $this->model->tagged->get();
    }

    public function tagNames()
    {
        return $this->model->tagNames();
    }

    public function withAnyTag($string)
    {
        return $this->model->withAnyTag($string);
    }

    public function withAllTags($string)
    {
        return $this->model->withAllTags($string);
    }
} 