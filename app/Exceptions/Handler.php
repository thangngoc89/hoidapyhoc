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
        if ($request->ajax())
        {
            if ($e instanceof \Illuminate\Session\TokenMismatchException)
                return response()->api()->setStatusCode(400)->withError("Can't verify CSRF Token", 'GEN-CSRF-TOKEN-ERROR');

            if ($e instanceof \Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException)
                return response()->api()->setStatusCode(429)->withError('Reach API access limit. Please try again after 1 minute','GEN-API-LIMIT');

            $error = [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ];

            return response()->json($error, 500);
        }

        if ($e instanceof \GuzzleHttp\Exception\ClientException)
            return redirect('/')->with('error','Đã có lỗi xảy ra trong quá trình đăng nhập
                                                <br>Hãy đồng ý truy cập của Hỏi Đáp Y Học tới tài khoản của bạn
                                                <br>hoặc chọn phương thức đăng nhập khác');

		if ($this->isHttpException($e))
		{
            return $this->renderHttpException($e);
		}
		else
		{
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

}
