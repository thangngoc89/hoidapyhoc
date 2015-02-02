<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Http\Request;
use Quiz\Http\Requests\API\RoleCreateRequest;
use Sorskod\Larasponse\Larasponse;
use Quiz\Models\Enstrust\Role;
use Quiz\Models\Enstrust\Permission;
use Quiz\lib\API\Role\RoleTransformers;

class RoleV2Controller extends APIController {

    protected $user;


    protected $role;
    /**
     * @var Larasponse
     */
    private $fractal;
    /**
     * @param Role $role
     * @param Request $request
     * @param Larasponse $fractal
     */
    public function __construct(Role $role, Larasponse $fractal)
    {
        $this->role = $role;
        $this->fractal = $fractal;

        $this->middleware('admin');
    }

    public function index(Request $request)
    {
        $roles = $this->builder($request,$this->role);

        $result = $this->fractal->paginatedCollection($roles, new RoleTransformers());

        return $this->makeResponse($result);
    }

    public function show($role)
    {
        return $this->fractal->item($role, new RoleTransformers());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(RoleCreateRequest $request)
    {
        try {
            $role = $this->role;

            $role->name = $request->name;

            $role->save();

            $role->perms()->sync($request->permissions);

            return response()->json($this->show($role), 201);

        } catch (\Exception $e) {

            return $this->throwError($e);

        }

    }


    public function update($role)
    {
        $rules = array(
            'name' => 'required|min:3',
            'permissions' => 'required',
        );

        $validator = Validator::make(Input::all(), $rules);
        if ($validator->passes())
        {
            $inputs = Input::except('csrf_token');
            $role->name = $inputs['name'];
            $role->save();
            $role->perms()->sync($inputs['permissions']);

            return $this->show($role->id);
        } else {
            $statusCode = 400;
            $messages = $validator->messages();
        }
        return Response::json($messages, $statusCode);
    }

    public function destroy($id)
    {
        try
        {
            $role = $this->role->findOrFail($id);
            if ($role->assigned_role()->count() > 0)
                throw new Exception ('This Role was assigned to user(s). CAN NOT delete');
            else
                $role->delete();

        } catch (Exception $e){
            $statusCode = 400;
            $error = $e->getMessage();
            return Response::json($error, $statusCode);
        }
    }
}
