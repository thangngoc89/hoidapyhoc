<?php namespace Quiz\lib\API\Exam;

use League\Fractal\TransformerAbstract;
use Quiz\Models\Exam;
use Quiz\Models\History;

class ExamTransformers extends TransformerAbstract {

    /**
     * List of resources possible to include
     *
     * @var array
     */
    protected $availableIncludes = [
        'user'
    ];

    public function transform(Exam $exam)
    {
        return [
            'id'            => (int) $exam->id,
            'user_id'       => (int) $exam->user_id,
            'name'          => $exam->name,
            'slug'          => $exam->slug,
            'description'   => $exam->description,
            'content'       => $exam->content,
            'thoigian'      => (int) $exam->thoigian,
            'questionsCount' => $exam->questions_count,
            'questions'      => $exam->questions,
            'beginFrom'     => (int) $exam->begin,
            'file'          => $this->file($exam),
            'tags'          => $exam->tagged->lists('name'),
            'approved'      => (boolean) $exam->is_approve,
            'created_at'    => (string) $exam->created_at,
            'updated_at'    => (string) $exam->updated_at
        ];
    }

    public function createResponse(Exam $exam)
    {
        return [
            'id'        => $exam->id,
            'url'       => $exam->link(),
            'editUrl'   => $exam->link('edit'),
        ];
    }

    private function file($exam)
    {
        if ($exam->is_file)
            return [
                'id' => $exam->file->id,
                'link' => $exam->file->url(),
            ];
        return '';
    }

} 