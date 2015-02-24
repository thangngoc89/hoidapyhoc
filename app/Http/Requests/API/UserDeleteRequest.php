<?php namespace Quiz\Http\Requests\API;

use Illuminate\Auth\Guard;
use Quiz\Http\Requests\Request;

class UserDeleteRequest extends Request {
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
        if ($this->auth->user()->can('manage_users'))
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
			//
		];
	}

}
