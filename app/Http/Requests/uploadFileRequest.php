<?php namespace Quiz\Http\Requests;

use Illuminate\Contracts\Auth\Guard;
use Quiz\Http\Requests\Request;

class uploadFileRequest extends Request {

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
            'file'   => 'required|mimes:pdf,jpeg,bmp,png,jpg|max:10240' //10MB - In kilobytes
		];
	}

}
