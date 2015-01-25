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

    public function with(array $with = array());

    public function has($relation);

    public function get();
}