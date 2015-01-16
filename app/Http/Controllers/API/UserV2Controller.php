<?php namespace Quiz\Http\Controllers\API;

use Quiz\Http\Controllers\API\APIController;
use Quiz\Models\User;
class UserV2Controller extends APIController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
    protected $user;
    public function __construct(User $user)
    {
        parent::__construct();
        $this->user         = $user;
    }
	public function index()
	{
        try{
            $statusCode = 200;
            $builder = ApiHandler::parseMultiple($this->user->with('history'), array('name,username'), $this->passParams('users'));
            $users = $builder->getResult();
            $response = [];
            foreach($users as $user){
                $response[] = $this->responseMap($user);
            }

            return $this->makeResponse($response,$statusCode, $builder);
        }catch (Exception $e){
            $statusCode = 500;
            $message = $e->getMessage();
            return Response::json($message, $statusCode);
        }
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		//
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
        try{
            $statusCode = 200;
            $user = User::find($id);

            $response = $this->responseMap($user);

            return Response::json($response,$statusCode);

        }catch (Exception $e){
            $statusCode = 500;
            return Response::json($e->getMessage(), $statusCode);
        }
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
        $user = $this->user->findOrFail($id);
        $user->delete();
        return 'Deleted';
	}

    private function responseMap($object)
    {
        return [
            'id'            => $object->id,
            'name'          => $object->name,
            'email'         => $object->email,
            'username'      => $object->username,
            'history'       => $object->history->count(),
            'avatar'        => $object->getAvatar(),
        ];
    }

}
