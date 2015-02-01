<?php namespace Quiz\lib\API\Exam;

use Quiz\Models\Exam;
use Quiz\Models\Question;

class ExamEditSaver
{
    /**
     * Helper function to save a edited test on TestV2Controller@edit method
     */

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
    public function __construct(array $attributes, $test)
    {
        $this->attributes = $attributes;
        $this->test = $test;
    }

    public function save()
    {
        $test = $this->test->fill($this->attributes);

        if (count($this->attributes['questions']) != $test->question->count())
            throw new \Exception("QuestionsAreNotEqual");
        if (!$test->save())
            throw new \Exception("ErrorWhenSaveTest");

        $test->retag($this->attributes['tags']);
        $this->editQuestion();

        return $test;
    }

    public function editQuestion()
    {
        $questions = $this->test->question();

        foreach ($questions as $key => $q)
        {
            $updateData = $this->attributes['questions'][$key];
            $q->fill($updateData);

            if (!$q->save())
                throw new \Exception ("ErrorWhenSaveQuestion");
        }
    }
} 