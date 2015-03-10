<?php namespace Quiz\Http\Controllers\Web;

use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Hpatoio\Bitly\Client;

class ExternalLinkController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
        return view('site.link.shorten');
	}


}
