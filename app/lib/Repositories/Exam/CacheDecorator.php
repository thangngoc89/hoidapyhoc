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
    public function __construct(ExamRepository $repo, CacheInterface $cache)
    {
        parent::__construct($repo);
        $this->cache = $cache;
    }

    /**
     * @return mixed
     */
    public function all()
    {
        $key = 'all';

        if($this->cache->has($key))
        {
            return $this->cache->get($key);
        }

        $exams = $this->repo->all();

        $this->cache->put($key, $exams);

        return $exams;
    }

    /**
     * @param $id
     * @return mixed
     */
    public function find($id)
    {
        $key = 'exam' . $id;

        if ($this->cache->has($key))
        {
            return $this->cache->get($key);
        }

        $exam = $this->repo->find($id);

        $this->cache->put($key, $exam);

        return $exam;
    }

    /**
     * @return mixed|string
     */
    public function getTable()
    {
        $key = 'table_name';

        if ($this->cache->has($key))
            return $this->cache->get($key);

        $tableName = $this->repo->getTable();

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

        $columnsList = $this->repo->getColumnsList();

        $this->cache->put($key, $columnsList);

        return $columnsList;
    }

    public function doneTestId($user)
    {
        $key = 'user_done_exam_ids' . $user->id;

        if ($this->cache->setTag(['exams','history'])->has($key))
            return $this->cache->setTag(['exams','history'])->get($key);

        $examIds = $this->repo->doneTestId($user);

        $this->cache->setTag(['exams','history'])->put($key, $examIds);

        return $this->repo->doneTestId($user);
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

        $exams = $this->repo->relatedExams($exam, $amount);

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

        $exams = $this->repo->getUserPostedExamWithRelations($userId, $paginate, $relations);

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

        $exams = $this->repo->getLatestExamsWithRelations($paginate, $relations, $approved);

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

        $exams = $this->repo->getUserPostedExamWithRelations($userId, $paginate, $relations);

        $this->cache->setTag(['exams','history'])->put($key, $exams);

        return $exams;
    }
}