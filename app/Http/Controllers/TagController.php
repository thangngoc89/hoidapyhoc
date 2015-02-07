<?php namespace Quiz\Http\Controllers;

use Illuminate\Auth\Guard;
use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Quiz\lib\Repositories\Exam\ExamRepository;
use Quiz\lib\Repositories\Tag\TagRepository as Tag;
use Quiz\Services\TagHomePage;

class TagController extends Controller {
    /**
     * @var Tag
     */
    private $tag;
    /**
     * @var Request
     */
    private $request;

    /**
     * @param Tag $tag
     * @param Request $request
     */
    public function __construct(Tag $tag, Request $request)
    {
        $this->tag = $tag;
        $this->request = $request;
    }
	/**
	 * Display a listing of the resource.
	 *
	 * @return TagHomePage
	 */
	public function index(TagHomePage $view)
    {
        return $view->execute($this->request);
    }

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($slug, ExamRepository $tests, Guard $auth)
	{
        $tag = $this->tag->where('slug',$slug)->first();

        if (is_null($tag))
            abort(404);

        #TODO: Expand function when have new taggable object
        $doneTestId = ($auth->check()) ? $tests->doneTestId($auth->user()) : false;
        $name = "Tag {$tag->name}";

        $key = $this->request->url().$this->request->page;

        $tests = \Cache::tags('tags','index')->remember($key, 10, function() use ($tag, $tests)
        {
            return $tests->withAllTags($tag->name)->with('tagged','user')->paginate(20);
        });

        $tests->appends($this->request->except('page'));

        return view('quiz.index',compact('tests','name','doneTestId'));
	}

}
