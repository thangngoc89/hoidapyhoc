<?php namespace Quiz\Http\Controllers;

use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;
use Quiz\lib\Helpers\Str;
use Quiz\lib\Repositories\Exam\ExamRepository as Exam;
use Quiz\lib\Repositories\Tag\TagRepository as Tag;
use Illuminate\Http\Request;
use Illuminate\Cache\CacheManager as Cache;

class SitemapController extends Controller {

    protected $exam;
    /**
     * @var Tag
     */
    private $tag;

    /**
     * @internal param Exam $exam
     * @param Exam $exam
     * @param Tag $tag
     */
    public function __construct(Exam $exam, Tag $tag)
    {
        $this->exam = $exam;
        $this->tag = $tag;
    }
	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index($sitemap, Request $request, Cache $cache)
	{
        $key = $request->url();

        if ($cache->has($key))
            return $cache->get($key);

        $sitemap = $this->generateSitemap($sitemap);

        $response = response($sitemap)->header('Content-Type', 'text/xml');

        $cache->put($key,$response, 30);

        return $response;

    }

    /**
     * @param $sitemap
     */
    private function generateSitemap($sitemap)
    {
        try {
            $sitemap = Str::camel($sitemap);
            return $this->{$sitemap}();

        } catch (\Exception $e) {

            if ($e instanceof \BadMethodCallException)
                abort(404);
        }
    }

    /**
     * Generate global sitemap
     * @return \Illuminate\View\View
     */
    public function sitemap()
    {
        $sitemaps = ['exams','tags'];
        return view('site.sitemap.index',compact('sitemaps'))->render();
    }

    /**
     * Generate sitemap for exams
     * @return \Illuminate\View\View
     */
    public function sitemapExams()
    {
        $exams = $this->exam->all();
        return view('site.sitemap.exam',compact('exams'))->render();
    }

    /**
     * Generate sitemap for tags
     * @return \Illuminate\View\View
     */
    public function sitemapTags()
    {
        $tags = $this->tag->has('exams')->get();
        return view('site.sitemap.tags',compact('tags'))->render();
    }
}
