<?php
namespace Quiz\lib\Repositories;

abstract class AbstractBaseDecorator {

    public function all()
    {
        return $this->repo->all();
    }

    public function find($id)
    {
        return $this->repo->getColumnsList($id);
    }

    public function findBy($column, $value)
    {
        return $this->repo->findBy($column, $value);
    }

    public function findOrFail($id)
    {
        return $this->repo->findOrFail($id);
    }

    public function firstOrNew($attributes)
    {
        return $this->repo->firstOrNew($attributes);
    }

    public function firstOrCreate($attributes)
    {
        return $this->repo->firstOrCreate($attributes);
    }

    public function whereRaw($query, $variables = null)
    {
        return $this->repo->whereRaw($query, $variables);
    }

    public function where($key, $method, $value = null)
    {
        return $this->repo->where($key, $method, $value);
    }

    public function whereIn($key, $array)
    {
        return $this->repo->whereIn($key, $array);
    }

    public function orWhere($key, $value)
    {
        return $this->orWhere($key, $value);
    }

    public function search($query, $divided = 4)
    {
        return $this->repo->search($query, $divided);
    }

    public function getFirstBy($key, $value, array $with = array())
    {
        return $this->repo->getFirstBy($key, $value, $with);
    }

    public function getManyBy($key, $value, array $with = array())
    {
        return $this->repo->where($key, $value, $with);

    }

    public function fill($input)
    {
        return $this->repo->fill($input);
    }

    public function create($input)
    {
        return $this->repo->create($input);
    }

    public function update($input)
    {
        return $this->repo->update($input);
    }

    public function orderBy($column, $direction = 'ASC')
    {
        return $this->repo->orderBy($column, $direction);
    }

    public function orderByRaw($query)
    {
        return $this->repo->orderBy($query);

    }

    public function latest()
    {
        return $this->repo->latest();
    }

    public function sortByDesc($callback)
    {
        return $this->repo->sortByDesc($callback);
    }

    public function with($with)
    {
        return $this->repo->with($with);
    }

    public function load($relationship)
    {
        return $this->repo->load($relationship);
    }

    public function has($relation)
    {
        return $this->repo->has($relation);
    }

    public function get($array = array())
    {
        return $this->repo->get($array);
    }

    public function paginate($number)
    {
        return $this->repo->paginate($number);
    }

    public function first()
    {
        return $this->repo->first();
    }

    public function count()
    {
        return $this->repo->count();
    }

    public function getTable()
    {
        return $this->repo->getTable();

    }

    /**
     * Return a array of all columns present in the models
     *
     * @return array
     */
    public function getColumnsList()
    {
        return $this->repo->getColumnsList();
    }

    /**
     * Tag a taggable item
     *
     * @param $string
     * @return mixed
     */
    public function tag($string)
    {
        return $this->repo->tag($string);
    }

    public function untag($string)
    {
        return $this->repo->untag($string);
    }

    public function retag($array)
    {
        return $this->repo->retag($array);
    }

    public function tagged()
    {
        return $this->repo->tagged();
    }

    public function tagNames()
    {
        return $this->repo->tagNames();
    }

    public function withAnyTag($string)
    {
        return $this->repo->withAllTags($string);
    }

    public function withAllTags($string)
    {
        return $this->repo->withAllTags($string);
    }
} 