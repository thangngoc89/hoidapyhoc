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

    public function findOrFails($id)
    {
        $entity = $this->find($id);
        if (is_null($entity))
            return abort(404);
        return $entity;
    }

    public function where($key, $value)
    {
        return $this->model->where($key, $value);
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
    public function has($relation, array $with = array())
    {
        $entity = $this->with($with);

        return $entity->has($relation)->get();
    }
} 