<?php namespace Quiz\Http\Controllers\API;

use Quiz\Commands\API\ParseQuery;

class APIController extends \Quiz\Http\Controllers\Controller {

    public function throwError($e)
    {
        $error = [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ];

        \Log::error('API Error',$error);

        return response()->json($error, 500);
    }

    public function builder($input, $model, $search = array(), $eagerLoad = array())
    {
        $command = new ParseQuery($input, $model, $search, $eagerLoad);

        return $this->dispatch($command);
    }


}