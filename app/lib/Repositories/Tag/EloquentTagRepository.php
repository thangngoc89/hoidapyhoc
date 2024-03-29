<?php namespace Quiz\lib\Repositories\Tag;

use Quiz\lib\Repositories\AbstractEloquentRepository;
use Quiz\Models\Tag;
use Quiz\lib\Repositories\Exam\ExamRepository as Exam;

class EloquentTagRepository extends AbstractEloquentRepository implements TagRepository {
    /**
     * @var Tag
     */
    protected $model;
    /**
     * @var Exam
     */
    private $exam;

    /**
     * @param Tag $model
     * @param Exam $exam
     */
    public function __construct(Tag $model, Exam $exam)
    {
        $this->model = $model;
        $this->exam = $exam;
    }

    /**
     * Return an array of all tags with count
     *
     * @return array
     */
    public function allTagsWithCount()
    {
        $key = 'allTagsWithCount';

        $cache = \Cache::tags('tags');

        if ($cache->has($key))
            return $cache->get($key);

        $tagList = $this->tagListOrderByExamCount();

        $tags = $this->tagsListTransformer($tagList);

        $cache->forever($key, $tags);

        return $tags;
    }
    /**
     * @param $testId
     * @return array
     */
    public function examSelectedTags($examId)
    {
        $key = 'selectedTags'.$examId;

        $cache = \Cache::tags('test'.$examId,'tags');

        if ($cache->has($key))
            return $cache->get($key);

        $tagList = $this->exam->findOrFail($examId)->tagged->all();

        $tags = [];
        foreach ($tagList as $tag)
        {
            $tags[] = [
                'text' => $tag->name,
                'selected' => (boolean) true,
                'count' => (int) $tag->count(),
            ];
        }

        $cache->forever($key, $tags);

        return $tags;
    }

    /**
     * Return an array of exam's tags list
     *
     * @param $examId
     * @return array
     */
    public function examTagNames($examId)
    {
        return $this->exam->find($examId)->tagNames();
    }

    /**
     * Create a Eloquent Collection of exam tag list
     * @return mixed
     */
    public function tagListOrderByExamCount()
    {
        $tagList = $this->with('exams')->take(50)->get();

        $tagList = $tagList->sortByDesc(function($tag)
        {
            return $tag->exams->count();
        });

        return $tagList;
    }

    public function searchByName($query)
    {
        return $this->model->where('name', 'like', '%' . $query . '%');
    }

    /**
     * Map return Eloquent Collection into an array
     *
     * @param $examId
     * @param $tagList
     * @return mixed
     */
    private function tagsListTransformer($tagList, $examId = null)
    {
        $tags = $tagList->map(function ($tag) use ($examId) {

            $selected = null;

            if (!is_null($examId))
                $selected = in_array($tag->name, $this->examTagNames($examId));

            return [
                'name' => $tag->name,
                'selected' => (boolean) $selected,
                'count' => (int)$tag->exams->count()
            ];
        });
        return $tags;
    }

}