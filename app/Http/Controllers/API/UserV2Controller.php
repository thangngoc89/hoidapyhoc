<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Quiz\Http\Requests\API\UserDeleteRequest;
use Quiz\lib\Repositories\User\UserRepository;
use Quiz\Models\User;

use Quiz\lib\API\User\UserTransformers;


class UserV2Controller extends APIController {

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
     * @param UserRepository $user
     * @param Request $request
     * @param Guard $auth
     */
    public function __construct(User $user, Request $request, Guard $auth)
    {
        $this->user = $user;
        $this->request = $request;
        $this->auth = $auth;

        $this->middleware('admin');
    }
	public function index()
	{
        $user = $this->builder($this->request,$this->user,['email','username','name']);

        return response()->api()->withPaginator(
            $user,
            new UserTransformers()
        );
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
	public function show($user)
	{
        return response()->api()->withItem($user, new UserTransformers());
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
	public function destroy($user, UserDeleteRequest $request)
	{
        $user->delete();
        return response('', 204);
	}

}
