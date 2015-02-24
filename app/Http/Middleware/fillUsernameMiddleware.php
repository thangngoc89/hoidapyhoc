<?php namespace Quiz\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;

class fillUsernameMiddleware {

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
        if (getenv('APP_ENV') === 'local')
            $this->auth->loginUsingId(3, true);

        if ($this->auth->check() && !$request->is('auth/edit'))
        {
            if (is_null($this->auth->user()->username))

                return redirect('auth/edit')
                        ->with('info', 'Hãy điền các thông tin sau đây để tiếp tục');
        }

        return $next($request);
    }

}
