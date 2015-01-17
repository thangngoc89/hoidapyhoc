<?php namespace Quiz\lib\Repositories\Exam;

interface ExamRepository {

    public function all();

    public function find($id);

    public function findOrFails($id);

    public function getFirstBy($key, $value, array $with = array());

    public function create($input);

    public function orderBy($column, $direction);

    public function doneTestId($user);

    public function link();

}