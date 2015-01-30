<?php namespace Quiz\Http\Controllers;

use Illuminate\Auth\Guard;
use Illuminate\Pagination\LengthAwarePaginator;
use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Quiz\lib\Repositories\Exam\ExamRepository;
use Quiz\lib\Tagging\Tag;
use Quiz\Models\Exam;

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
	 * @return Response
	 */
	public function index()
	{

        #TODO Cache this page ?????
        $perPage = 50;
        switch($request->tab)
        {
            case 'list':
                $tags = $this->tag->paginate($perPage);
                $name = 'Danh sách Tag';
                break;
            case 'new':
                $tags = $this->tag->orderBy('id','DESC')->take($perPage)->get();
                $name = 'Tag mới nhất';
                break;
            default :
                $tags = $this->tag->with('exams')->take(50)->get()->sortByDesc(function($query) {
                    return $query->exams->count();
                });
                $name = 'Tag nổi bật';
                break;
        }
        if ($tags instanceof LengthAwarePaginator)
            $tags->appends($request->except('page'));

        return view('site.tag', compact('tags','name'));
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($slug, Exam $tests, Guard $auth)
	{
        $tag = $this->tag->where('slug',$slug)->first();

        if (is_null($tag))
            abort(404);

        #TODO: Expand function when have new taggable object
//        $doneTestId = ($auth->check()) ? $tests->doneTestId($auth->user()) : false;
        $name = "Tag {$tag->name}";

        $key = $this->request->url();

//        $tests = \Cache::tags('tags','index')->remember($key, 10, function() use ($tag, $tests)
//        {
//            return $tests->has('question')->with('tagged','user')->withAllTags($tag->name)->paginate(20);
//        });

        $tests = $tests->withAnyTag($tag->name);

        dd($tests->toSql());
        $tests->appends($this->request->except('page'));

        return view('quiz.index',compact('tests','name','doneTestId'));
	}

}
