<?php namespace Quiz\lib\Repositories;

abstract class AbstractEloquentRepository {

    public function all()
    {
        $this->model->all();
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

    public function where($key, $value)
    {
        return $this->model->where($key, $value);
    }

    public function orWhere($key, $value)
    {
        return $this->model->orWhere($key, $value);
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
    public function orderBy($column, $direction)
    {
        return $this->model->orderBy($column, $direction);
    }

    /**
     * Eager Load of instance
     *
     * @param array $with
     * @return mixed
     */
    public function with(array $with = array())
    {
        return $this->model->with($with);
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

    public function get()
    {
        return $this->get();
    }

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
        return $this->model->tagged;
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