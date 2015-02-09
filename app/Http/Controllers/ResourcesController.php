<?php namespace Quiz\Http\Controllers;

use Intervention\Image\Facades\Image;
use Quiz\Commands\Site\ImageServer;
use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Quiz\lib\Helpers\OnlineServices;
use Quiz\Services\LeechImageFile;

use File;
use Cache;

class ResourcesController extends Controller {

    public function userAvatar($user, LeechImageFile $leecher)
    {
        return Cache::driver('file')->rememberForever("userAvatar{$user->id}", function () use ($user, $leecher) {

            $avatar = $user->avatar;

            if (!$avatar)
                $avatar = OnlineServices::getGravatar($user->email);

            $img = $leecher->execute($avatar);

            $response = response()->make($img);

            return $this->staticHeader($response);
        });

    }

    /**
     * Return an image from storage_path()/uploads/file
     * /files/image/{$size}/{$path}
     *
     * @param $size
     * @param $path
     * @return mixed
     */
    public function image($size, $path)
    {
        $response = $this->dispatch(new ImageServer($size, $path));
        return $this->staticHeader($response);
    }

    /**
     * Return pdf file download response
     * /files/pdf/{$filename.pdf}
     *
     * @param $file
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function pdf($file)
    {
        preg_match('/\.[^\.]+$/i',$file,$ext);
        if ($ext[0] != '.pdf')
            abort(404);

        $path = storage_path("uploads/".$file);

        if (!File::exists($path))
            abort(404);

        return response()->download($path);
    }

    public function staticHeader($response, $type = 'image/jpg')
    {
        $response->header('Pragma', 'public');
        $response->header('Content-Type', $type);
        $response->header('Cache-Control', 'public, max-age=');
        $response->header('Expires', gmdate('D, d M Y H:i:s \G\M\T', time() + 31557600));

        return $response;
    }

}
