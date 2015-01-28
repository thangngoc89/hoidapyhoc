<?php namespace Quiz\Http\Controllers;

use Quiz\lib\Repositories\Exam\ExamRepository;
use Quiz\Models\Exam;
use Quiz\Models\History;
use Quiz\Models\Testimonial;
use Quiz\Models\User;

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
	 * @return Response
	 */
	public function index(Testimonial $testimonial)
	{
        $testimonial = \Cache::tags('testimonial')->rememberForever('indexTestimonial', function() use ($testimonial)
        {
            return $testimonial->where('isHome','1')->limit(9)->get();
        });

        return view('index',compact('testimonial'));
	}
    public function stat(User $user, Exam $test, History $history)
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

    public function cleanCache(ExamRepository $test)
    {
        $t = $test->find(4)->tag(['Giải phẫu','Thi online']);
        dd($t);
    }

}
