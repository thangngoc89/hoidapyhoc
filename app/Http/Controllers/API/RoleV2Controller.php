<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Http\Request;
use Quiz\Http\Requests\API\RoleCreateRequest;
use Quiz\Http\Requests\API\RoleUpdateRequest;
use Quiz\Models\Enstrust\Role;
use Quiz\Models\Enstrust\Permission;
use Quiz\lib\API\Role\RoleTransformers;

class RoleV2Controller extends APIController {

    protected $role;
    /**
     * @param Role $role
     * @param Request $request
     */
    public function __construct(Role $role)
    {
        $this->role = $role;
        $this->middleware('admin');
    }

    public function index(Request $request)
    {
        $roles = $this->builder($request,$this->role);

        $result = response()->api()->withCollection($roles, new RoleTransformers());

        return $result;
    }

    /**
     * Show a role
     *
     * @param \Quiz\Models\Enstrust\Role
     * @return \Illuminate\Http\Response
     */
    public function show($role)
    {
        return response()->api()->withItem($role, new RoleTransformers());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Quiz\Models\Enstrust\Role
     * @return \Illuminate\Http\Response
     */
    public function store(RoleCreateRequest $request)
    {
        try {
            $role = $this->role->create($request->all());

            $role->perms()->sync($request->permissions);

            return response()->json($this->show($role), 201);

        } catch (\Exception $e) {

            return $this->throwError($e);
        }
    }

    /**
     * Update a resource in storage.
     *
     * @param \Quiz\Models\Enstrust\Role
     * @return \Illuminate\Http\Response
     */
    public function update($role, RoleUpdateRequest $request)
    {
        try {
            $role->name = $request->name;

            $role->save();

            $role->perms()->sync($request->permissions);

            return response()->json($this->show($role), 201);

        } catch (\Exception $e) {

            return $this->throwError($e);
        }
    }
    /**
     * Delete a resource
     *
     * @param \Quiz\Models\Enstrust\Role
     * @return \Illuminate\Http\Response
     */
    public function destroy($role)
    {
        #TODO: Add this validation on model's boot
        try
        {
            if ($role->users()->count() > 0)
                throw new \Exception ('This Role was assigned to user(s). CAN NOT delete');

            $role->delete();

            $response = ['message' => 'Role Deleted'];

            return response()->json($response, 204);

        } catch (\Exception $e){
            $this->throwError($e);
        }
    }
}
