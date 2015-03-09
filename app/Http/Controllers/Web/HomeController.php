<?php namespace Quiz\Http\Controllers\Web;

use Quiz\Http\Controllers\Controller;
use Quiz\lib\Repositories\Exam\ExamRepository;
use Quiz\lib\Repositories\History\HistoryRepository;
use Quiz\lib\Repositories\Tag\TagRepository;
use Quiz\lib\Repositories\User\UserRepository;

use Quiz\lib\Tagging\Tag;
use Quiz\Models\History;
use Quiz\Models\Testimonial;
use Quiz\Models\Upload;
use Quiz\Models\Video;
use Quiz\Services\Leecher\CSYK\GetQuiz;

class HomeController extends Controller {

	/*
	|--------------------------------------------------------------------------
	| Home Controller
	|--------------------------------------------------------------------------
	|
	| This controller renders your application's "dashboard" for users that
	| are authenticated. Of course, you are free to change or remove the
	| controller as you wish. It is just here to get your app started!
	|
	*/

	/**
	 * Create a new controller instance.
	 *
	 * @return void
	 */
	public function __construct()
	{

	}

	/**
	 * Show the application dashboard to the user.
	 *
	 * @return \Illuminate\View\View
	 */
	public function index(Testimonial $testimonial)
	{
        $testimonial = \Cache::tags('testimonial')->rememberForever('indexTestimonial', function() use ($testimonial)
        {
            return $testimonial->home()->limit(9)->get();
        });

        return view('index',compact('testimonial'));
	}

    /**
     * Show Website's Testimonials Page
     *
     * @param Testimonial $testimonial
     * @return \Illuminate\View\View
     */
    public function testimonials(Testimonial $testimonial)
    {
        $testimonial = \Cache::tags('testimonial')->rememberForever('testimonialPage', function() use ($testimonial)
        {
            return $testimonial->where('isHome','1')->get();
        });

        return view('site.testimonials', compact('testimonial'));
    }

    /**
     * Show Website Status (Refresh every 30 minutes)
     *
     * @param UserRepository $user
     * @param ExamRepository $test
     * @param History $history
     * @return \Illuminate\View\View
     */
    public function statistic(UserRepository $user, ExamRepository $test, HistoryRepository $history, Video $video)
    {
        $key = 'siteStat';
        if (\Cache::has($key)) {
            $stat = \Cache::get($key);
        } else {
            $user = $user->count();
            $test = $test->count();
            $history = $history->count();
            $video = $video->count();

            $stat = [$user, $test, $history, $video];
            \Cache::put($key, $stat, 30);
        }
        return view('site.stat', compact('stat'));
    }

    public function parseQuiz(GetQuiz $get)
    {
        $link = \Input::get('link');

        return $get->get($link)->parse();
    }

    public function cleanCache()
    {
        \Log::info('khoa');
    }

}
