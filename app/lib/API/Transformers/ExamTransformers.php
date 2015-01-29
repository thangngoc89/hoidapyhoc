<?php namespace Quiz\lib\API\Transformers;

use League\Fractal\TransformerAbstract;
use Quiz\Models\Exam;

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
            'questionCount' => $test->questionsCount(),
            'question'      => $test->questionsList(),
            'file'          => $this->file($test),
            'tags'          => $test->tagNames(),
            'approved'      => (boolean) $test->is_approve,
            'created_at'    => $test->created_at,
            'updated_at'    => $test->updated_at
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