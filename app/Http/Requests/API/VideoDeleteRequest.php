<?php namespace Quiz\Http\Requests\API;

use Illuminate\Contracts\Auth\Guard;
use Quiz\Http\Requests\Request;

class VideoDeleteRequest extends Request {

	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize(Guard $auth)
	{
        if ($auth->guest())
            return false;

        if ( ! $auth->user()->can('manage_videos'))
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
