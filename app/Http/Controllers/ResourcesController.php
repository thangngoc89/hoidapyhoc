<?php namespace Quiz\Http\Controllers;

use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Quiz\lib\Helpers\OnlineServices;
use Quiz\Services\LeechImageFile;

class ResourcesController extends Controller {

    public function userAvatar($user, LeechImageFile $leecher)
    {
        return \Cache::tags("user{$user->id}")->rememberForever("userAvatar{$user->id}", function () use ($user, $leecher) {
            $avatar = $user->avatar;
            if (!$avatar)
                $avatar = OnlineServices::getGravatar($user->email);

            $img = $leecher->execute($avatar);

            $response = response()->make($img);
            $response->header('Pragma', 'public');
            $response->header('Content-Type', 'image/jpg');
            $response->header('Cache-Control', 'public, max-age=');
            $response->header('Last-Modified', $user->updated_at);
            $response->header('Expires', gmdate('D, d M Y H:i:s \G\M\T', time() + 31557600));

            return $response;
        });

    }

}
