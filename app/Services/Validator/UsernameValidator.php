<?php
namespace Quiz\Services\Validator;

use Illuminate\Validation\Validator;

/**
 * Custom validator for input questions array
 *
 * Class QuestionValidator
 * @package Quiz\lib\Repositories\Exam
 */
class UsernameValidator extends Validator {

    public function validateUsername($attribute, $value, $parameters)
    {
        return preg_match('/^[A-Za-z0-9_]{1,20}$/', $value);
    }

}