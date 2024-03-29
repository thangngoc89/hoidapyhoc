<?php namespace Quiz\lib\Repositories;

interface BaseRepository {

    /**
     * Return all items of model
     *
     * @return mixed
     */
    public function all();

    /**
     * Find a item via id
     *
     * @param $id
     * @return mixed
     */
    public function find($id);

    public function findBy($column, $value);

    public function findOrFail($id);

    public function firstOrNew($attributes);

    public function firstOrCreate($attributes);

    public function whereRaw($query, $variables = null);

    public function where($key, $method, $value = null);

    public function whereIn($key, $array);

    public function orWhere($key, $value);

    public function search($query, $divided = 4);

    public function getFirstBy($key, $value, array $with = array());

    public function getManyBy($key, $value, array $with = array());

    public function fill($input);

    public function create($input);

    public function update($input);

    public function orderBy($column, $direction = 'ASC');

    public function orderByRaw($query);

    public function latest();

    public function sortByDesc($callback);

    public function with($with);

    public function load($relationship);

    public function has($relation);

    public function get($array = array());

    public function paginate($number);

    public function first();

    public function count();

    /**
     * Return table name of the model
     *
     * @return string
     */
    public function getTable();

    /**
     * Return a array of all columns present in the models
     *
     * @return array
     */
    public function getColumnsList();

    /**
     * Tag a taggable item
     *
     * @param $string
     * @return mixed
     */
    public function tag($string);

    public function untag($string);

    public function retag($array);

    public function tagged();

    public function tagNames();

    public function withAnyTag($string);

    public function withAllTags($string);
}