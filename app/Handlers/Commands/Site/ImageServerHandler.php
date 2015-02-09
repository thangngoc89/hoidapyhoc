<?php namespace Quiz\Handlers\Commands\Site;

use Quiz\Commands\Site\ImageServer;
use Image;
use Cache;
use File;

use Illuminate\Queue\InteractsWithQueue;

class ImageServerHandler {

	/**
	 * Create the command handler.
	 *
	 * @return void
	 */
	public function __construct()
	{
		//
	}

	/**
	 * Handle the command.
	 *
	 * @param  ImageServer  $command
	 */
	public function handle(ImageServer $command)
	{
        $path = storage_path("uploads/".$command->path);
        $size = $command->size;

        $key = 'image_cache'.$path.$size;
        if (Cache::driver('file')->has($key))
            return Cache::driver('file')->get($key);


        if (!File::exists($path))
            abort(404);

        if (!method_exists('\Quiz\Handlers\Commands\Site\ImageServerHandler',$size))
            abort(404);

        $image = Image::make($path);
        $image = $this->{$size}($image)->response();

        Cache::driver('file')->forever($key, $image);

        return $image;
	}

    public function big($image)
    {
        return $image->resize(1300 , null, function ($constraint) {
            $constraint->aspectRatio();
        })->encode('jpg', 80);
    }

    public function medium($image)
    {
        return $image->resize(800, null, function ($constraint) {
            $constraint->aspectRatio();
        })->encode('jpg', 80);
    }

    public function small($image)
    {
        return $image->resize(600, null, function ($constraint) {
            $constraint->aspectRatio();
        })->encode('jpg', 80);
    }
}
