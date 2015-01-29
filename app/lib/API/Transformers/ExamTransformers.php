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
            'questions'     => $test->totalQuestions(),
            'is_file'       => (boolean) $test->is_file,
            'file'          => $test->file->url(),
            'approved'      => (boolean) $test->is_approve,
            'created_at'    => $test->created_at,
            'updated_at'    => $test->updated_at
        ];
    }

} 