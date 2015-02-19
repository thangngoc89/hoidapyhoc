<?php namespace Quiz\Services;

use Quiz\lib\Repositories\Tag\TagRepository;
use Illuminate\Cache\Repository as Cache;

class TagHomePage {

    private $tag;

    /**
     * Number of tags per page
     * @var $name
     */
    private $perPage = 50;
    /*
    * Output result
    * @var $name
    */
    private $tags;

    /*
     * Title and jumbotron name
     * @var $name
     */
    private $name;

    /*
    * Request from controller
    * @var $name
    */
    private $request;
    /**
     * @var Cache
     */
    private $cache;

    /**
     * @param TagRepository $tag
     * @param Cache $cache
     */
    public function __construct(TagRepository $tag, Cache $cache)
    {
        $this->tag = $tag;
        $this->cache = $cache;
    }

    /**
     * Main method to create response
     *
     * @param $request
     * @return \Illuminate\View\View
     * @throws \Exception
     */
    public function execute($request)
    {
//        $key = $request->url().implode('.',$request->all());

        // Set Cache tag for incoming cache handle
//        $cache = $this->cache->tags('tags');

        // If there this page was cached, show result immediately
//        if ($cache->has($key))
//            return $cache->get($key);

        $this->request = $request;

        // Get method name
        $tab = $this->switchMethod();

        // Excute query to get data from database
        $this->{$tab}();

        $view = $this->makeView();

//        $cache->put($key,$view,10);

        return $view;

    }

    public function listTab()
    {
        $this->tags = $this->tag->has('exams')->paginate($this->perPage);
        $this->name = 'Danh sách Tag';

        $this->tags->appends($this->request->except('page'));
    }

    public function popularTab()
    {
        $this->tags = $this->tag->has('exams')->with('exams')->take($this->perPage)->get()->sortByDesc(function($query) {
                    return $query->exams->count();
                });
        $this->name = 'Tag nổi bật';
    }

    public function newTab()
    {
        $this->tags = $this->tag->has('exams')->orderBy('id','DESC')->take($this->perPage)->get();
        $this->name = 'Tag mới nhất';
    }

    /**
     * Generate view
     * @return \Illuminate\View\View
     */
    public function makeView()
    {
        $tags = $this->tags;
        $name = $this->name;

        return view('site.tag', compact('tags','name'))->render();
    }

    /**
     * Return proper method base on tab name
     * @param $request
     * @return string
     * @throws \Exception
     */
    private function switchMethod()
    {
        $tab = $this->request->tab;

        if (!$tab)
            $tab = 'popular';
        if (!in_array($tab, ['popular', 'new', 'list']))
            throw new \Exception ('TabNotFound');
        $tab .= 'Tab';
        return $tab;
    }
} 