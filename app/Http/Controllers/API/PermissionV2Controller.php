<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Http\Request;
use Quiz\lib\API\Permission\PermissionTransformers;
use Quiz\Models\Enstrust\Permission;

use Sorskod\Larasponse\Larasponse;


class PermissionV2Controller extends APIController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
    protected $permission;
    /**
     * @var Larasponse
     */
    private $fractal;
    /**
     * @var Request
     */
    private $request;

    /**
     * @param Permission $permission
     * @param Request $request
     * @param Larasponse $fractal
     */
    public function __construct(Permission $permission, Request $request, Larasponse $fractal)
    {
        $this->permission = $permission;
        $this->fractal = $fractal;
        $this->request = $request;

        $this->middleware('admin');
    }
	public function index()
	{
        $permissions = $this->builder($this->request,$this->permission);

        $result = $this->fractal->paginatedCollection($permissions, new PermissionTransformers());

        return $this->makeResponse($result);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		//
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($permission)
	{
        return $this->fractal->item($permission, new PermissionTransformers());
	}


	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		dd(Input::all());
	}

	/**
	 * Update the specified resource in storage.
	 *
     * @method PUT
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
        return Response::json(Input::all());
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
        $test = $this->permission->findOrFail($id);
        $test->delete();
        return 'Deleted';
	}
}
