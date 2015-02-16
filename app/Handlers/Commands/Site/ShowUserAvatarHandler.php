<?php namespace Quiz\Handlers\Commands\Site;

use Quiz\Commands\Site\ShowUserAvatar;

use Illuminate\Queue\InteractsWithQueue;

use Cache;
use Quiz\lib\Helpers\OnlineServices;
use Quiz\Services\LeechImageFile;



class ShowUserAvatarHandler {
    /**
     * @var LeechImageFile
     */
    private $leecher;

    /**
	 * Create the command handler.
	 *
	 * @return void
	 */
	public function __construct(LeechImageFile $leecher)
	{
        $this->leecher = $leecher;
    }

	/**
	 * Handle the command.
	 *
	 * @param  ShowUserAvatar  $command
	 */
	public function handle(ShowUserAvatar $command)
	{
        $user = $command->user;

        $key ="userAvatar{$user->id}";

        if (Cache::driver('file')->has($key))
            return Cache::driver('file')->get($key);

        $avatar = $this->getAvatarLink($user);

        $image = $this->leecher->execute($avatar)->response();

        Cache::driver('file')->forever($key, $image);

        return $image;
	}

    /**
     * @param $user
     * @return string
     */
    private function getAvatarLink($user)
    {
        $avatar = $user->avatar;

        if (!$avatar)
            $avatar = OnlineServices::getGravatar($user->email);

        return $avatar;
    }


}
