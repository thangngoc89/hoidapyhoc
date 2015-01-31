<?php namespace Quiz\Http\Controllers\API;

use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Quiz\lib\Repositories\Exam\ExamRepository;
use Quiz\lib\Tagging\Tag;

class SearchV2Controller extends Controller {
    /**
     * @var Request
     */
    private $request;
    /**
     * @var ExamRepository
     */
    private $test;
    /**
     * @var Tag
     */
    private $tag;

    /**
     * @param Request $request
     */
    public function __construct(Request $request, ExamRepository $test, Tag $tag)
    {
        $this->request = $request;
        $this->test = $test;
        $this->tag = $tag;
    }

    public function index()
    {
        $query = e($this->request->get('q',''));

        if(!$query && $query == '')
            return response()->json(['error' => 'No query'], 400);

        $tests = $this->getTestsResponse($query);
        $tags = $this->getTagsResponse($query);

        $data = array_merge($tests, $tags);
        $response = [
            'data' => $data
        ];

        return response()->json($response,200);
    }

    /**
     * @param $query
     * @return mixed
     */
    public function getTestsResponse($query)
    {
        $tests = $this->test
            ->where('name','like','%'.$query.'%')
            ->orderBy('name','asc')
            ->take(5)
            ->get(array('id','slug','name'))->toArray();

        $tests  = $this->appendURL($tests, 'quiz/lam-bai');
        $tests = $this->appendValue($tests, 'exam', 'group');

        return $tests;
    }

    /**
     * @param $query
     * @return mixed
     */
    public function getTagsResponse($query)
    {
        $tags = $this->tag
            ->where('name', 'like', '%' . $query . '%')
            ->has('exams')
            ->take(5)
            ->get(array('slug', 'name'))
            ->toArray();

        $tags = $this->appendURL($tags, 'tag');
        $tags = $this->appendValue($tags, 'tag', 'group');

        return $tags;
    }
    public function appendValue($data, $type, $element)
    {
        // operate on the item passed by reference, adding the element and type
        foreach ($data as $key => & $item) {
            $item[$element] = $type;
        }
        return $data;
    }

    public function appendURL($data, $prefix)
    {
        // operate on the item passed by reference, adding the url based on slug
        foreach ($data as $key => & $item) {
            $item['url'] = url($prefix.'/'.$item['slug']);
        }
        return $data;
    }

}
