<?php namespace Quiz\Http\Requests\API;

use Entrust;
use Quiz\Http\Requests\Request;

class LinkParagraphShortenRequest extends Request {

	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
        if (Entrust::can('link_shorten'))
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
			'paragraph' => 'required|min:10',
		];
	}

}
