<?php namespace Quiz\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;

class AdminAccess {
    /**
     * @var Guard
     */
    private $auth;

    /**
     * @param Guard $auth
     */
    public function __construct(Guard $auth)
    {
        $this->auth = $auth;
    }
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
        if (!$this->auth->check() || !$this->auth->user()->hasRole('admin'))
        {
            if ($request->ajax())
            {
                return response('Unauthorized.', 401);
            }
            else
            {
                return redirect()->guest('auth/login')
                    ->with('danger','Bạn không có quyền truy cập trang này');
            }
        }

        return $next($request);
	}

}
