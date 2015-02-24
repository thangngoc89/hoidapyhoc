<?php namespace Quiz\Http\Controllers\API;

use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Quiz\lib\Repositories\Exam\ExamRepository;
use Quiz\lib\Tagging\Tag;
use Quiz\Models\Video;

class SearchV2Controller extends Controller {
    /**
     * @var Request
     */
    private $request;
    /**
     * @var ExamRepository
     */
    private $exam;
    /**
     * @var Tag
     */
    private $tag;
    /**
     * @var Video
     */
    private $video;

    /**
     * @param Request $request
     * @param ExamRepository $test
     * @param Tag $tag
     * @param Video $video
     */
    public function __construct(Request $request, ExamRepository $exam, Tag $tag, Video $video)
    {
        $this->request = $request;
        $this->exam = $exam;
        $this->tag = $tag;
        $this->video = $video;
    }

    public function index()
    {
        $query = e($this->request->get('q',''));

        if(!$query && $query == '')
            return response()->json(['error' => 'No query'], 400);

        $tests = $this->getExamsResponse($query)->toArray();
        $tags = $this->getTagsResponse($query)->toArray();
        $videos = $this->getVideosResponse($query)->toArray();

        $data = array_merge($tests, $tags, $videos);
        $response = [
            'data' => $data
        ];

        return response()->json($response,200);
    }

    /**
     * @param $query
     * @return mixed
     */
    public function getExamsResponse($query)
    {
        $exams = \Cache::tags('exams')->remember('exams_search_'.$query, 60, function () use ($query)
        {
            return $this->exam
                ->search($query)
                ->take(5)
                ->get(array('id','slug','name'));
        });

        $mapper = $exams->map(function($test){
                return [
                    'name' => $test->name,
                    'url'  => url("quiz/lam-bai/{$test->slug}/{$test->id}"),
                    'group' => 'exam'
                ];
            });

        return $mapper;
    }

    /**
     * @param $query
     * @return mixed
     */
    public function getTagsResponse($query)
    {
        $tags = \Cache::tags('tags')->remember('tags_search_'.$query, 60, function () use ($query)
        {
            return $this->tag
                ->search($query)
                ->take(5)
                ->get(array('slug', 'name'));
        });

        $mapper = $tags->map(function($tag){
            return [
                'name' => $tag->name,
                'url'  => url("tag/{$tag->slug}"),
                'group' => 'tag'
            ];
        });

        return $mapper;
    }

    public function getVideosResponse($query)
    {
        $videos = \Cache::tags('videos')->remember('videos_search_'.$query, 60, function () use ($query)
        {
            return $this->video
            ->search($query)
            ->take(5)
            ->get(array('id','slug','title'));
        });

        $mapper = $videos->map(function($video){
            return [
                'name' => $video->title,
                'url'  => url($video->link()),
                'group' => 'video'
            ];
        });

        return $mapper;

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
