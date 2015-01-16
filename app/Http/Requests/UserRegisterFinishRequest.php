<?php namespace Quiz\Http\Requests;

use Quiz\Http\Requests\Request;

class UserRegisterFinishRequest extends Request {

	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
        if (\Auth::check())
		    return true;
        else
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
			'name'  => 'required|min:6',
            'username'  => 'required|min:3|alpha_num|unique:users'
		];
	}

	/**
	 * Get the sanitized input for the request.
	 *
	 * @return array
	 */
	public function sanitize()
	{
		return $this->all();
	}

    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function forbiddenResponse()
    {
        return $this->redirector->to('/');
    }

    /**
     * @return array
     */
    public function messages()
    {
        return [
            'username.unique' => 'Tên thành viên này đã có người sử dụngphp',
//            'email.unique' => 'Email already taken m8',
        ];
    }


}
