<?php namespace Quiz\Http\Controllers\Site;

use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Quiz\lib\Repositories\Exam\ExamRepository;

class RedirectController extends Controller {


	/**
	 * Redirect quiz url
     * quiz/t/{slug} ===> quiz/lam-bai/{slug}/{id}
	 *
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
	 */
	public function quiz($slug, ExamRepository $exam)
	{
        $quiz = $exam->getFirstBy('slug',$slug);

        if ( is_null($quiz) )
            abort(404);

        return redirect($quiz->link(), 301);
	}

    /**
     * Redirect category to tag url
     * quiz/c/{slug} ===> tag/{slug}
     *
     * @param $slug
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function category($slug)
    {
        $url = "/tag/{$slug}";

        return redirect($url, 301);
    }

    /**
     * Redirect user profile page
     * user/profile/{username} ===> @{username}
     *
     * @param $username
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function userProfile($username)
    {
        $url = "/@".$username;

        return redirect($url, 301);
    }

}
