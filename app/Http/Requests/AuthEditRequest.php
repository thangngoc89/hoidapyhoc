<?php namespace Quiz\Http\Requests;

use Illuminate\Validation\Validator;

class AuthEditRequest extends Request {

	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
        if (\Auth::check()) {
            return true;
        }

        return false;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
        $user = $this->user();

		$rules = [
			'name'  => 'required|min:6',
            'username'  => 'required|min:3|username|unique:users,username,'. $user->id,
            'email' => 'email|unique:users,email,'. $user->id,
		];

        // Require user to type in their email
        if (is_null($user->email)) {
            $rules['email'] .= '|required';
        }

        return $rules;
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
            'required'      => 'Bạn phải nhập :attribute.',
            'min'           => ':attribute phải có độ dài tối thiểu :min',
            'username.required' => 'Tên thành viên không được để trống',
            'username.unique' => 'Tên thành viên này đã có người sử dụng',
            'username.email' => 'Email này đã có người sử dụng',
            'name.min'     => 'Tên có độ dài tối thiểu 6 kí tự'
        ];
    }


}
