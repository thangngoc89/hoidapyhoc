<?php namespace Quiz\Http\Controllers;

use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Quiz\lib\Helpers\OnlineServices;
use Quiz\Services\LeechImageFile;

class ResourcesController extends Controller {

    public function userAvatar($user, LeechImageFile $leecher)
    {
        $avatar = $user->avatar;
        if (!$avatar)
            $avatar = OnlineServices::getGravatar($user->email);

        $img = $leecher->execute($avatar);

        $response = response()->make($img);
        $response->header('Content-Type', 'image/jpg');
        $response->header('Cache-Control', 'max-age=3600 public');

        return $response;
    }

}
