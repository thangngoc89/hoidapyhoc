<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;

use Quiz\lib\Repositories\Tag\TagRepository as Tag;
use Quiz\lib\API\Tag\TagTransformers;
use Sorskod\Larasponse\Larasponse;

class TagV2Controller extends APIController {

    /**
     * @var Request
     */
    private $request;
    /**
     * @var Guard
     */
    private $auth;
    /**
     * @var Larasponse
     */
    private $fractal;
    /**
     * @var Tag
     */
    private $tag;

    /**
     * @param Tag $tag
     * @param Request $request
     * @param Guard $auth
     * @param Larasponse $fractal
     */
    public function __construct(Tag $tag, Request $request, Guard $auth, Larasponse $fractal)
    {
        $this->request = $request;
        $this->auth = $auth;
        $this->fractal = $fractal;
        $this->tag = $tag;
    }


	public function index()
	{
        $tags = $this->builder($this->request,$this->tag,['name']);

        $result = $this->fractal->paginatedCollection($tags, new TagTransformers());

        return $result;
    }

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store(ExamSaveRequest $request, ExamTransformers $transformer)
	{
        return $this->tryCatch(function() use ($transformer,$request)
        {
            $test = new ExamStoreSaver($request->all());
            $test = $test->save();
            $response = $transformer->createResponse($test);

            return $response;
        });
    }

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($tag)
	{
        return $this->fractal->item($tag, new TagTransformers());
	}

    /**
     * Update the specified resource in storage.
     *
     * @param $test
     * @param ExamEditRequest $request
     * @param ExamTransformers $transformer
     * @internal param int $id
     * @return Response
     */
    public function update($test, ExamEditRequest $request, ExamTransformers $transformer)
    {
        return $this->tryCatch(function() use ($transformer,$request, $test)
        {
            $test = new ExamEditSaver($request->all(),$test);
            $test = $test->save();
            $response = $transformer->createResponse($test);

            event( new ExamUpdateEvent($test));

            return $response;
        });
    }

    /**
     * Return an array of tag base on query
     *
     * @param $query
     */
    public function search($query)
    {
        $tags = $this->tag->searchByName($query)->paginate(20);

        return $this->fractal->paginatedCollection($tags, new TagTransformers());

    }
	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($test)
	{
//        $test->delete();
        return 'Deleted';
	}

}
