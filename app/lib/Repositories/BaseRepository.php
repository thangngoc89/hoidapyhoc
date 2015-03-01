<?php namespace Quiz\lib\Repositories;

interface BaseRepository {

    public function all();

    public function find($id);

    public function findOrFail($id);

    public function firstOrNew($array);

    public function firstOrCreate($array);

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

    public function getTable();

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