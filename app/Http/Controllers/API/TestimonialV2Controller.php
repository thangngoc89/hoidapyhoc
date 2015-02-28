<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Http\Request;
use Quiz\lib\API\Testimonial\TestimonialTransformers;
use Quiz\Models\Testimonial;

class TestimonialV2Controller extends APIController {

    private $testimonial;

    /**
     * @param Testimonial $testimonial
     * @internal param Request $request
     */
    public function __construct(Testimonial $testimonial)
    {
        $this->testimonial = $testimonial;
        $this->middleware('admin', ['except' => ['index']]);

    }

    public function index(Request $request)
    {
        $testimonials = $this->builder($request,$this->testimonial);

        $result = response()->api()->withPaginator($testimonials, new TestimonialTransformers());

        return $result;
    }

    /**
     * Show a role
     *
     * @param \Quiz\Models\Testimonial
     * @return \Illuminate\Http\Response
     */
    public function show($testi)
    {
        return response()->api()->withItem($testi, new TestimonialTransformers());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Quiz\Models\Testimonial
     * @return \Illuminate\Http\Response
     */
    public function store()
    {

    }

    /**
     * Update a resource in storage.
     *
     * @param \Quiz\Models\Testimonial
     * @return \Illuminate\Http\Response
     */
    public function update()
    {

    }
    /**
     * Delete a resource
     *
     * @param \Quiz\Models\Enstrust\Role
     * @return \Illuminate\Http\Response
     */
    public function destroy()
    {

    }
}
