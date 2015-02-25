<?php namespace Quiz\Http\Controllers\Web;

use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AdminController extends Controller {

    public function __construct()
    {
        $this->middleware('admin');
    }
	/**
	 * Display admin page
	 *
	 * @return Response
	 */
	public function index()
	{
        return view('site.admin');
	}

    public function deploy(Request $request)
    {
        return $this->dispatch($request);
    }



}
