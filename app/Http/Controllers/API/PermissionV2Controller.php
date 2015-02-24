<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Http\Request;
use Quiz\Models\Enstrust\Permission;

use Quiz\Http\Requests\API\PermissionCreateRequest;
use Quiz\Http\Requests\API\PermissionDeleteRequest;
use Quiz\Http\Requests\API\PermissionUpdateRequest;

use Quiz\lib\API\Permission\PermissionTransformers;

class PermissionV2Controller extends APIController {

    /**
     * @var Permission $permission
     */
    protected $permission;

    /**
     * @param Permission $permission
     * @param Request $request
     */
    public function __construct(Permission $permission)
    {
        $this->permission = $permission;
        $this->middleware('admin');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
	public function index(Request $request)
	{
        $permissions = $this->builder($request,$this->permission);

        $result = response()->api()->withCollection($permissions, new PermissionTransformers());

        return $result;
	}

    /**
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(PermissionCreateRequest $request)
    {
        try {
            $perm = $this->permission->create($request->all());

            return response()->json($this->show($perm), 201);

        } catch (\Exception $e) {

            return $this->throwError($e);
        }
    }

	/**
	 * Display the specified resource.
	 *
     * @param Permission $perm
	 * @return \Illuminate\Http\Response
	 */
	public function show($perm)
	{
        return response()->api()->withItem($perm, new PermissionTransformers());
	}

	/**
	 * Update the specified resource in storage.
	 *
     * @param Permission $perm
	 * @return \Illuminate\Http\Response
	 */
    public function update($perm, PermissionUpdateRequest $request)
    {
        try {
            $perm->update($request->all());

            return response()->json($this->show($perm), 200);

        } catch (\Exception $e) {

            return $this->throwError($e);
        }
    }

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param Permission $perm
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($perm, PermissionDeleteRequest $request)
	{
        try {
            $perm->delete();

            return response()->json('Deleted', 204);

        } catch (\Exception $e) {

            return $this->throwError($e);
        }
	}
}
