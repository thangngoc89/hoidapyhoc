<?php namespace Quiz\Http\Requests\API;

use Illuminate\Auth\Guard;
use Quiz\Http\Requests\Request;

class PermissionCreateRequest extends Request {

	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize(Guard $auth)
	{
        if (!$auth->check())
            return false;
        if (!$auth->user()->can('manage_permissions'))
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
            'name' => 'required|between:4,128|unique:permissions',
            'display_name' => 'required|between:4,128'
		];
	}

}
