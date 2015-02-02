<?php namespace Quiz\lib\API\Exam;

use Quiz\Models\Exam;
use Quiz\Models\Question;

class ExamStoreSaver
{
    /**
     * Helper function to save a new test on TestV2Controller@store method
     */
    /**

    /**
     * @var Exam
     */
    private $test;
    /**
     * @var Question
     */
    private $question;

    /**
     * @param array $attributes
     * @param Exam $test
     * @param Question $question
     */
    public function __construct(array $attributes)
    {
        $this->attributes = $attributes;
    }

    public function save()
    {
        return \DB::transaction(function()
        {
            $exam = new Exam($this->attributes);
            if (!$exam->save())
                throw new \Exception("ErrorWhenSaveTest");

            $exam->tag($this->attributes['tags']);
            $this->storeQuestion($exam->id);

            return $exam;
        });

    }

    public function storeQuestion($id)
    {
        foreach ($this->attributes['questions'] as $q)
        {
            $question = new Question($q);
            $question->test_id = $id;
            if (!$question->save())
                throw new \Exception ("ErrorWhenSaveQuestion");
        }
    }
} 