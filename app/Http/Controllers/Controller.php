<?php namespace Quiz\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesCommands;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\JsonResponse;

abstract class Controller extends BaseController {

	use DispatchesCommands, ValidatesRequests;

    public function tryCatch($callback)
    {
        try{
            if (is_array($callback) && isset($callback['statusCode']))
                return $this->callBackIsArray($callback);
            return $this->callBackIsResult($callback);

        }catch (\Exception $e){
            $statusCode = ($e->getCode() != 0) ?: 500;
            $error = [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ];
            return response()->json($error, $statusCode);
        }
    }

    public function callBackIsArray($callback)
    {
        return response()->json(call_user_func($callback['result']), $callback['statusCode']);
    }

    private function callBackIsResult($callback)
    {
        return response()->json(call_user_func($callback), 200);
    }
}
