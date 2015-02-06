<?php namespace Quiz\Http\Controllers;

use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;
use Quiz\lib\Helpers\Str;
use Quiz\lib\Repositories\Exam\ExamRepository as Exam;
use Quiz\lib\Repositories\Tag\TagRepository as Tag;
use Quiz\lib\Repositories\User\UserRepository as User;
use Illuminate\Http\Request;
use Illuminate\Cache\CacheManager as Cache;
use Quiz\Models\Video;

class SitemapController extends Controller {

    protected $exam;
    /**
     * @var Tag
     */
    private $tag;
    /**
     * @var Video
     */
    private $video;
    /**
     * @var User
     */
    private $user;

    /**
     * @internal param Exam $exam
     * @param Exam $exam
     * @param Tag $tag
     * @param Video $video
     * @param User $user
     */
    public function __construct(Exam $exam, Tag $tag, Video $video, User $user)
    {
        $this->exam = $exam;
        $this->tag = $tag;
        $this->video = $video;
        $this->user = $user;
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
        $sitemaps = ['exams','tags','videos','users'];
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
        $tags = $this->tag->get();
        return view('site.sitemap.tags',compact('tags'))->render();
    }

    /**
     * Generate sitemap for videos
     * @return \Illuminate\View\View
     */
    public function sitemapVideos()
    {
        $videos = $this->video->get();
        return view('site.sitemap.videos',compact('videos'))->render();
    }

    /**
     * Generate sitemap for users
     * @return \Illuminate\View\View
     */
    public function sitemapUsers()
    {
        $users = $this->user->get();
        return view('site.sitemap.users',compact('users'))->render();
    }
}
