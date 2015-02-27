<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

use Quiz\Http\Requests\API\TagDeleteRequest;
use Quiz\lib\Repositories\Tag\TagRepository as Tag;
use Quiz\lib\API\Tag\TagTransformers;

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
     * @var Tag
     */
    private $tag;

    /**
     * @param Tag $tag
     * @param Request $request
     * @param Guard $auth
     */
    public function __construct(Tag $tag, Request $request, Guard $auth)
    {
        $this->request = $request;
        $this->auth = $auth;
        $this->tag = $tag;
    }

	public function index()
	{
        $tags = $this->builder($this->request,$this->tag,['name']);

        $result = response()->api()->withPaginator($tags, new TagTransformers());

        return $result;
    }

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($tag)
	{
        return response()->api()->withItem($tag, new TagTransformers());
	}

    /**
     * Update the specified resource in storage.
     *
     * @param $test
     * @internal param int $id
     * @return Response
     */
    public function update($tag)
    {
        //
    }

    /**
     * Return an array of tag base on query
     *
     * @param $query
     */
    public function search($query)
    {
        #TODO: Add serialize here (for search accurate)
        $tags = $this->tag->searchByName($query)->paginate(20);

        return response()->api()->withPaginator($tags, new TagTransformers());
    }
	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($tag, TagDeleteRequest $request)
	{
        $tag->delete();

        return response('',204);
	}

}
