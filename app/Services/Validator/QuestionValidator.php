<?php
namespace Quiz\Services\Validator;

use Illuminate\Validation\Validator;

/**
 * Custom validator for input questions array
 *
 * Class QuestionValidator
 * @package Quiz\lib\Repositories\Exam
 */
class QuestionValidator extends Validator {

    public function validateQuestions($attribute, $value, $parameters)
    {
        if (!is_array($value))
            return false;
        foreach ($value as $question)
        {
            if (!is_array($question))
                return false;
            if ( !isset($question['answer']) || !$this->answerKey($question['answer']) )
                return false;
        }

        return true;
    }

    /**
     * Question answer on can be these in $acceptString array
     *
     * @param $key
     * @return bool
     */
    public function answerKey($key)
    {
        $acceptString = ['A','B','C','D','E'];
        if ( !in_array($key, $acceptString) )
            return false;
        return true;

    }

}