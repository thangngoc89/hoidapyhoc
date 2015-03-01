<?php namespace Quiz\Http\Requests;

use Illuminate\Contracts\Auth\Guard;
use Quiz\Http\Requests\Request;

class ExamDeleteRequest extends Request {

	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize(Guard $auth)
	{
        if (!$auth->check())
		    return false;
        if (!$auth->user()->can('manage_exams'))
            return false;

        return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		return [
			//
		];
	}

}
