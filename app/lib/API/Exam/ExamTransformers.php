<?php namespace Quiz\lib\API\Exam;

use League\Fractal\TransformerAbstract;
use Quiz\Models\Exam;
use Quiz\Models\History;

class ExamTransformers extends TransformerAbstract {

    public function transform(Exam $test)
    {
        return [
            'id'            => (int) $test->id,
            'user_id'       => (int) $test->user_id,
            'name'          => $test->name,
            'slug'          => $test->slug,
            'description'   => $test->description,
            'content'       => $test->content,
            'thoigian'      => (int) $test->thoigian,
            'questionsCount' => $test->questionsCount(),
            'questions'      => $test->questionsList(),
            'file'          => $this->file($test),
            'tags'          => $test->tagNames(),
            'approved'      => (boolean) $test->is_approve,
            'created_at'    => $test->created_at,
            'updated_at'    => $test->updated_at
        ];
    }

    public function createResponse(Exam $test)
    {
        return [
            'id'        => $test->id,
            'url'       => $test->link(),
            'editUrl'   => $test->link('edit'),
        ];
    }

    public function checkResponse(History $history)
    {
        return [
            'score' => $history->score,
            'totalQuestion' => $history->test->questionsCount(),
            'url'   => '/quiz/ket-qua/'.$history->test->slug.'/'.$history->id,
        ];
    }

    private function file($test)
    {
        if ($test->is_file)
            return [
                $test->file->id,
                $test->file->url(),
            ];
        return '';
    }

    private function tag($test)
    {
        $tagged = $test->tagged()->get();
        $tags = array();
        if ($tagged->count() == 0)
            return '';
        foreach ($tagged as $tag)
        {
            $tags []= [
                'id' => $tag->id,
                'name' => $tag->name
            ];
        }

        return '';
    }

} 