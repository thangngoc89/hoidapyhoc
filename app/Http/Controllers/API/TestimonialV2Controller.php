<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Http\Request;
use Quiz\lib\API\Testimonial\TestimonialTransformers;
use Quiz\Models\Testimonial;

use Sorskod\Larasponse\Larasponse;

class TestimonialV2Controller extends APIController {

    protected $testimonial;
    /**
     * @var Larasponse
     */
    private $fractal;

    /**
     * @param Testimonial $testimonial
     * @param Larasponse $fractal
     * @internal param Request $request
     */
    public function __construct(Testimonial $testimonial, Larasponse $fractal)
    {
        $this->fractal = $fractal;
        $this->testimonial = $testimonial;
        $this->middleware('admin', ['except' => ['index']]);

    }

    public function index(Request $request)
    {
        $testimonials = $this->builder($request,$this->testimonial);

        $result = $this->fractal->paginatedCollection($testimonials, new TestimonialTransformers());

        return $this->makeResponse($result);
    }

    /**
     * Show a role
     *
     * @param \Quiz\Models\Testimonial
     * @return \Illuminate\Http\Response
     */
    public function show($testi)
    {
        return $this->fractal->item($testi, new TestimonialTransformers());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Quiz\Models\Testimonial
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
     * @param \Quiz\Models\Testimonial
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
