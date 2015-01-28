<?php namespace Quiz\lib\Repositories;

interface BaseRepository {

    public function all();

    public function find($id);

    public function findOrFail($id);

    public function firstOrNew($array);

    public function where($key, $value);

    public function orWhere($key, $value);

    public function getFirstBy($key, $value, array $with = array());

    public function getManyBy($key, $value, array $with = array());

    public function fill($input);

    public function create($input);

    public function update($input);

    public function orderBy($column, $direction);

    public function sortByDesc($callback);

    public function with(array $with = array());

    public function has($relation);

    public function get();

    public function paginate($number);

    public function first();

    public function count();

    public function tag($string);

    public function untag($string);

    public function retag($array);

    public function tagged();

    public function tagNames();

    public function withAnyTag($string);

    public function withAllTags($string);
}