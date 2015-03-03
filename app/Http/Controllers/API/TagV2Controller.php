<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Quiz\Commands\API\TagAutoCompleteCommand;
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
        $tags = $this->builder($this->request, $this->tag, ['name'], ['exams','videos']);

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

    public function autoComplete($query)
    {
        $items = $this->dispatch(new TagAutoCompleteCommand($query));

        #TODO : Move this into fractal

        $ret = [];
        foreach($items as $item)
        {
            if (is_array($item))
                $ret[] = ['name' => $item['name']];
            else
            {
                $item = explode(':', $item)[1];
                $ret[] = ['name' => $item];
            }
        }

        return response()->json(['data' => $ret]);
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

    public function store(Request $request)
    {
        $tag = $this->tag->fill($request->all());

        $tag->save();

    }


}
