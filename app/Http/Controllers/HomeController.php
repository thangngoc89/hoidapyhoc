<?php namespace Quiz\Http\Controllers;

use Quiz\lib\Repositories\Exam\ExamRepository;
use Quiz\lib\Repositories\User\UserRepository;

use Quiz\lib\Tagging\Tag;
use Quiz\Models\History;
use Quiz\Models\Testimonial;

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
    public function stat(UserRepository $user, ExamRepository $test, History $history)
    {
        $key = 'siteStat';
        if (\Cache::has($key)) {
            $stat = \Cache::get($key);
        } else {
            $user = $user->count();
            $test = $test->count();
            $history = $history->count();

            $stat = [$user,$test,$history];
            \Cache::put($key, $stat, 30);
        }
        return view('site.stat', compact('stat'));
    }

    public function admin()
    {
        return view('site.admin');
    }

    public function cleanCache(Tag $tag)
    {
        $all = $tag->join('taggables','tagging_tags.id','=','taggables.tag_id')
                    ->where('taggables.tag_id',169)
                    ->groupBy('taggables.taggable_id')
                    ->get();

//        dd($all);

        $all = \DB::table('tagging_tags')
                ->selectRaw('`tagging_tags`.*, `taggables`.`taggable_id` as `pivot_taggable_id`, `taggables`.`tag_id` as `pivot_tag_id`')
            ->where(`tag_id`,14)
            ->join('taggables','tagging_tags.id','=' ,'taggables.tag_id')
                ->get();

        dd($all);
    }

}
