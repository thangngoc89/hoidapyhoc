<?php namespace Quiz\Http\Requests\Exam;

use Quiz\Http\Requests\Request;

class TestCheckRequest extends Request {

	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
        if (\Auth::check())
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
			'user_history_id' => 'required|exists:history,id',
            'answers' => 'required|array',
		];
	}

}
