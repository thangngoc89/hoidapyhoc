<?php namespace Quiz\Http\Requests\API;

use Illuminate\Contracts\Auth\Guard;
use Quiz\Http\Requests\Request;

class RoleUpdateRequest extends Request {
    /**
     * @var Guard
     */
    private $auth;

    /**
     * @param Guard $auth
     */
    public function __construct(Guard $auth)
    {
        $this->auth = $auth;
    }
	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
        if (!$this->auth->check())
            return false;
        if (!$this->auth->user()->can('manage_roles'))
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
        $roles = $this->route()->roles;
        return [
            'name' => 'required|min:3|unique:roles,id,'.$roles->id,
            'permissions' => 'required|array',
        ];
	}

}
