<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Http\Request;
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
     * @var Request
     */
    private $request;


    /**
     * @param Role $role
     * @param Request $request
     * @param Larasponse $fractal
     */
    public function __construct(Role $role, Request $request,Larasponse $fractal)
    {
        $this->role = $role;
        $this->fractal = $fractal;
        $this->request = $request;

        $this->middleware('admin');
    }

    public function index()
    {
        $roles = $this->builder($this->request,$this->role);

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
     * @return Response
     */
    public function store()
    {
        $rules = array(
            'name' => 'required|min:3',
            'permissions' => 'required',
        );

        $validator = Validator::make(Input::all(), $rules);
        if ($validator->passes())
        {
            $inputs = Input::except('csrf_token');
            $this->role->name = $inputs['name'];
            $this->role->save();
            $this->role->perms()->sync($inputs['permissions']);

            // Was the role created?
            if ($this->role->id)
            {
                return $this->show($this->role->id);
            } else {
                $statusCode = 500;
                $message = 'Something happen from our server';
            }
        } else {
            $statusCode = 400;
            $messages = $validator->messages();
        }
        return Response::json($messages, $statusCode);
    }


    public function update($id)
    {
        $role = $this->role->findOrFail($id);
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
