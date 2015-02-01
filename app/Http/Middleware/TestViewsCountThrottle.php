<?php namespace Quiz\Http\Middleware;

use Closure;
use Illuminate\Session\Store;

class TestViewsCountThrottle {

    /**
     * @var Store
     */
    private $session;

    public function __construct(Store $session)
    {
        // Let Laravel inject the session Store instance,
        // and assign it to our $session variable.
        $this->session = $session;
    }

	/**
	 * This middle view handle incoming request and remove all old
     * Count throttle of viewed_tests array
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
    public function handle($request, Closure $next)
    {
        $tests = $this->getViewedPosts();

        if ( ! is_null($tests))
        {
            $tests = $this->cleanExpiredViews($tests);

            $this->storeTests($tests);
        }

        return $next($request);
    }

    private function getViewedPosts()
    {
        // Get all the viewed posts from the session. If no
        // entry in the session exists, default to null.
        return $this->session->get('viewed_tests', null);
    }

    private function cleanExpiredViews($tests)
    {
        $time = time();

        // Let the views expire after one hour.
        $throttleTime = 3600;

        // Filter through the post array. The argument passed to the
        // function will be the value from the array, which is the
        // timestamp in our case.
        return array_filter($tests, function ($timestamp) use ($time, $throttleTime)
        {
            // If the view timestamp + the throttle time is
            // still after the current timestamp the view
            // has not expired yet, so we want to keep it.
            return ($timestamp + $throttleTime) > $time;
        });
    }

    private function storeTests($tests)
    {
        $this->session->put('viewed_tests', $tests);
    }

}
