<?php
namespace Quiz\lib\Repositories\Exam;

use Quiz\Models\User;
use Quiz\Services\Cache\CacheInterface;

class CacheDecorator extends AbstractExamDecorator {

    /**
     * @var CacheInterface
     */
    protected $cache;

    /**
     * @param ExamRepository $user
     * @param CacheInterface $cache
     */
    public function __construct(ExamRepository $exam, CacheInterface $cache)
    {
        parent::__construct($exam);
        $this->cache = $cache;
    }

    public function all()
    {
        $key = 'all';

        if($this->cache->has($key))
        {
            return $this->cache->get($key);
        }

        $exams = $this->exam->all();

        $this->cache->put($key, $exams);

        return $exams;
    }

    public function find($id)
    {
        $key = 'exam' . $id;

        if ($this->cache->has($key))
        {
            return $this->cache->get($key);
        }

        $exam = $this->exam->find($id);

        $this->cache->put($key, $exam);

        return $exam;
    }

    public function findOrFail($id)
    {
        return $this->exam->findOrFail($id);
    }

    public function firstOrNew($attributes)
    {
        return $this->exam->firstOrNew($attributes);
    }

    public function firstOrCreate($attributes)
    {
        return $this->exam->firstOrCreate($attributes);
    }

    public function whereRaw($query, $variables = null)
    {
        return $this->exam->whereRaw($query, $variables);
    }

    public function where($key, $method, $value = null)
    {
        return $this->exam->where($key, $method, $value);
    }

    public function whereIn($key, $array)
    {
        return $this->exam->whereIn($key, $array);
    }

    public function orWhere($key, $value)
    {
        return $this->orWhere($key, $value);
    }

    public function search($query, $divided = 4)
    {
        return $this->exam->search($query, $divided);
    }

    public function getFirstBy($key, $value, array $with = array())
    {
        return $this->exam->getFirstBy($key, $value, $with);
    }

    public function getManyBy($key, $value, array $with = array())
    {
        return $this->exam->where($key, $value, $with);

    }

    public function fill($input)
    {
        return $this->exam->fill($input);
    }

    public function create($input)
    {
        return $this->exam->create($input);
    }

    public function update($input)
    {
        return $this->exam->update($input);
    }

    public function orderBy($column, $direction = 'ASC')
    {
        return $this->exam->orderBy($column, $direction);
    }

    public function orderByRaw($query)
    {
        return $this->exam->orderBy($query);

    }

    public function latest()
    {
        return $this->exam->latest();
    }

    public function sortByDesc($callback)
    {
        return $this->exam->sortByDesc($callback);
    }

    public function with($with)
    {
        return $this->exam->with($with);
    }

    public function load($relationship)
    {
        return $this->exam->load($relationship);
    }

    public function has($relation)
    {
        return $this->exam->has($relation);
    }

    public function get($array = array())
    {
        return $this->exam->get($array);
    }

    public function paginate($number)
    {
        return $this->exam->paginate($number);
    }

    public function first()
    {
        return $this->exam->first();
    }

    public function count()
    {
        return $this->exam->count();
    }

    public function getTable()
    {
        $key = 'table_name';

        if ($this->cache->has($key))
            return $this->cache->get($key);

        $tableName = $this->exam->getTable();

        $this->cache->put($key, $tableName);

        return $tableName;
    }

    /**
     * Return a array of all columns present in the models
     *
     * @return array
     */
    public function getColumnsList()
    {
        $key = 'columns_list';

        if ($this->cache->has($key))
            return $this->cache->get($key);

        $columnsList = $this->exam->getColumnsList();

        $this->cache->put($key, $columnsList);

        return $columnsList;
    }

    /**
     * Tag a taggable item
     *
     * @param $string
     * @return mixed
     */
    public function tag($string)
    {
        return $this->exam->tag($string);
    }

    public function untag($string)
    {
        return $this->exam->untag($string);
    }

    public function retag($array)
    {
        return $this->exam->retag($array);
    }

    public function tagged()
    {
        return $this->exam->tagged();
    }

    public function tagNames()
    {
        return $this->exam->tagNames();
    }

    public function withAnyTag($string)
    {
        return $this->exam->withAllTags($string);
    }

    public function withAllTags($string)
    {
        return $this->exam->withAllTags($string);
    }

    public function doneTestId($user)
    {
        $key = 'user_done_exam_ids' . $user->id;

        if ($this->cache->setTag(['exams','history'])->has($key))
            return $this->cache->setTag(['exams','history'])->get($key);

        $examIds = $this->exam->doneTestId($user);

        $this->cache->setTag(['exams','history'])->put($key, $examIds);

        return $this->exam->doneTestId($user);
    }

    /**
     * @param \Quiz\Models\Exam $exam
     * @param int $amount
     * @return mixed
     */
    public function relatedExams($exam, $amount = 5)
    {
        $key = 'relatedExams_' . $exam->id;

        if ($this->cache->has($key))
            return $this->cache->get($key);

        $exams = $this->exam->relatedExams($exam, $amount);

        $this->cache->forever($key, $exams);

        return $exams;
    }

    /**
     * Return an collection of exams were posted by user
     *
     * @param $userId
     * @param null $paginated
     * @return \Illuminate\Support\Collection;
     */
    public function getUserPostedExamWithRelations($userId, $paginate = false, array $relations = [])
    {
        $key = md5( 'user_' . $userId . '_posted_exam_with_relations_' . implode('_', $relations) . \Request::get('page') );

        if ($this->cache->has($key))
            return $this->cache->get($key);

        $exams = $this->exam->getUserPostedExamWithRelations($userId, $paginate, $relations);

        $this->cache->put($key, $exams);

        return $exams;
    }

    /**
     * Return an collection of latest exams with relations
     *
     * @param bool $paginate
     * @param bool $approved
     * @return \Illuminate\Support\Collection;
     */
    public function getLatestExamsWithRelations($paginate = false, array $relations = [], $approved = true)
    {
        $key = md5( 'latest_exams_' . \Request::get('page') );

        if ($this->cache->has($key))
            return $this->cache->get($key);

        $exams = $this->exam->getLatestExamsWithRelations($paginate, $relations, $approved);

        $this->cache->put($key, $exams);

        return $exams;
    }

    /**
     * Return an collection of exams were done by user
     *
     * @param $userId
     * @param bool $paginate
     * @param array $relations
     * @return \Illuminate\Support\Collection;
     */
    public function getUserDoneExamsWithRelations($userId, $paginate = false, array $relations = [])
    {
        $key = md5( 'user_' . $userId . '_done_exams_' . \Request::get('page') );

        if ($this->cache->setTag(['exams','history'])->has($key))
            return $this->cache->setTag(['exams','history'])->get($key);

        $exams = $this->exam->getUserPostedExamWithRelations($userId, $paginate, $relations);

        $this->cache->setTag(['exams','history'])->put($key, $exams);

        return $exams;
    }
}