<?php namespace Quiz\Http\Requests\Exam;

use Illuminate\Contracts\Auth\Guard;
use Quiz\Http\Requests\Request;

class ExamCreateRequest extends Request {

	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize(Guard $auth)
	{
        if ($auth->check())
            return true;
		return false;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		return [
			'name' => 'required|min:6|unique:tests',
            'thoigian' => 'required|integer|between:5,200',
            'content' => 'required',
            'begin' => 'required|integer|min:1',
            'tags'   => 'required',
            'questions' => 'required|array'
		];
	}

}
