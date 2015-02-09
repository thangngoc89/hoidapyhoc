<?php namespace Quiz\Http\Controllers;

use Intervention\Image\Facades\Image;
use Quiz\Commands\Site\ImageServer;
use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Quiz\lib\Helpers\OnlineServices;
use Quiz\Services\LeechImageFile;

class ResourcesController extends Controller {

    public function userAvatar($user, LeechImageFile $leecher)
    {
        return \Cache::driver('file')->rememberForever("userAvatar{$user->id}", function () use ($user, $leecher) {

            $avatar = $user->avatar;

            if (!$avatar)
                $avatar = OnlineServices::getGravatar($user->email);

            $img = $leecher->execute($avatar);

            $response = response()->make($img);

            return $this->imageHeader($response);
        });

    }

    /**
     * Return an image from storage_path()/uploads/file
     *
     * @param $size
     * @param $path
     * @return mixed
     */
    public function image($size, $path)
    {
        $response = $this->dispatch(new ImageServer($size, $path));
        return $this->imageHeader($response);
    }

    public function shortUrl($uuid)
    {

    }

    public function imageHeader($response)
    {
        $response->header('Pragma', 'public');
        $response->header('Content-Type', 'image/jpg');
        $response->header('Cache-Control', 'public, max-age=');
        $response->header('Expires', gmdate('D, d M Y H:i:s \G\M\T', time() + 31557600));

        return $response;
    }

}
