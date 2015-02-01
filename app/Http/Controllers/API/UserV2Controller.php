<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use Quiz\lib\Repositories\User\UserRepository;
use Quiz\Models\User;
use Sorskod\Larasponse\Larasponse;

use Quiz\lib\API\User\UserTransformers;


class UserV2Controller extends APIController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
    protected $user;
    /**
     * @var Request
     */
    private $request;
    /**
     * @var Guard
     */
    private $auth;
    /**
     * @var Larasponse
     */
    private $fractal;

    /**
     * @param UserRepository $user
     * @param Request $request
     * @param Guard $auth
     * @param Larasponse $fractal
     */
    public function __construct(User $user, Request $request, Guard $auth, Larasponse $fractal)
    {
        $this->user = $user;
        $this->request = $request;
        $this->auth = $auth;
        $this->fractal = $fractal;
    }
	public function index()
	{
        $user = $this->builder($this->request,$this->user,['email','username','name']);

        $result = $this->fractal->paginatedCollection($user, new UserTransformers());

//        return $result;
        return $this->makeResponse($result);
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
