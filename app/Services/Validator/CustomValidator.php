<?php
namespace Quiz\Services\Validator;

use Illuminate\Validation\Validator;


class CustomValidator extends Validator {

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

    public function validateUsername($attribute, $value, $parameters)
    {
        return preg_match('/^[A-Za-z0-9_]{1,20}$/', $value);
    }

}