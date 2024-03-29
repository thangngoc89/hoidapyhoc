<?php namespace Quiz\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;

class FillMissingUserInfo {

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
    public function __construct(Guard $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Redirect if User did not fill Username
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        // If this is a unauthenticated request
        // skip it immedialy
        if ($this->auth->guest())
            return $next($request);

        $path = $this->getRequestPath($request);
        $ignorePaths = ['/files','/build','/_debugbar','/auth/logout','/api'];

        foreach($ignorePaths as $ignorePath)
        {
            if (starts_with($path, $ignorePath))
                return $next($request);
        }

        // Don't applied this middleware to un-reading request.
        // The user won't able is post anything
        if ( ! $this->isReading($request))
            return $next($request);

        if ($this->auth->check() && ! $request->is('auth/edit'))
        {
            $user = $this->auth->user();

            if ( is_null($user->username) || empty($user->email) )

                return redirect('auth/edit')
                        ->with('info', 'Hãy điền các thông tin sau đây để tiếp tục');
        }

        return $next($request);
    }

    private function getRequestPath($request)
    {
        $url = $request->getUri();
        $path = parse_url($url)['path'];

        return $path;
    }

    private function isReading($request)
    {
        return in_array($request->method(), ['HEAD', 'GET', 'OPTIONS']);
    }

}
