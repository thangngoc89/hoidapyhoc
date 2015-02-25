<?php namespace Quiz\Exceptions;

use Exception;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\Debug\ExceptionHandler as SymfonyDisplayer;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Request;
use Log;

class Handler extends ExceptionHandler {

	/**
	 * A list of the exception types that should not be reported.
	 *
	 * @var array
	 */
	protected $dontReport = [
		'Symfony\Component\HttpKernel\Exception\HttpException'
	];

	/**
	 * Report or log an exception.
	 *
	 * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
	 *
	 * @param  \Exception  $e
	 * @return void
	 */
	public function report(Exception $e)
	{
		return parent::report($e);
	}

	/**
	 * Render an exception into an HTTP response.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Exception  $e
	 * @return \Illuminate\Http\Response
	 */
	public function render($request, Exception $e)
	{
//        $path = parse_url(Request::url())['path'];
//
//        if (starts_with($path, '/api'))
//            return $this->apiResponse($e);

		if ($this->isHttpException($e))
		{
            return $this->renderHttpException($e);
		}
		else
		{
//            return parent::render($request, $e);

            if ($e instanceof ApiException)
                \Log::error($e);

//            if (env('APP_ENV') === 'production')
//            {

//            }

            return $this->renderExceptionWithWhoops($e);
        }

    }
    /**
     * Render an exception using Whoops.
     *
     * @param  \Exception $e
     * @return \Illuminate\Http\Response
     */
    protected function renderExceptionWithWhoops(Exception $e)
    {
        $whoops = new \Whoops\Run;
        $whoops->pushHandler(new \Whoops\Handler\PrettyPageHandler());

        return new \Illuminate\Http\Response(
            $whoops->handleException($e),
            $e->getStatusCode(),
            $e->getHeaders()
        );
    }

    /**
     * Render the given HttpException.
     *
     * @param  \Symfony\Component\HttpKernel\Exception\HttpException  $e
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function renderHttpException(HttpException $e)
    {
        $status = $e->getStatusCode();

        $dataArray = [
            '404' => 'Oops! Không tìm thấy trang bạn đang yêu cầu',
            '403' => 'Bạn không được phép truy cập trang này',
            '503' => 'Trang web đang được bảo trì. Quay lại sau nhé',
            '500' => 'Oops! Có lỗi xảy ra từ phía chúng tớ. Hãy kiên nhẫn nhé. Chúng tớ sẽ sửa nhanh thôi'
        ];

        if ( isset($dataArray[$status]) )
        {
            $data = [
                'status' => $status,
                'message' => $dataArray[$status],
            ];
            return response()->view('layouts.errorLayout', $data, $status);
        }
        else
        {
            return (new SymfonyDisplayer(config('app.debug')))->createResponse($e);
        }
    }

    #TODO: Need more love here
    private function apiResponse(Exception $e)
    {
        $message = [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ];

        $error_code = ($e->getCode() && $e->getCode() >= 100) ?: 500;

        return response()->api()->setStatusCode(500)->withError($message, $error_code);
    }

}
