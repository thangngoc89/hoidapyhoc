<?php namespace Quiz\Http\Requests\API;

use Quiz\Http\Requests\Request;
use Entrust;

class LinkShortenRequest extends Request {

	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		if ( Entrust::can('link_shorten') )
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
			'link' => 'required|url',
            'customUrl' => 'min:4',
		];
	}

}
