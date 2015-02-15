<?php namespace Quiz\Commands\Site;

use Quiz\Commands\Command;
use Quiz\Models\User;

class ShowUserAvatar extends Command {
    /**
     * @var User
     */
    public $user;


    /**
     * Create a new command instance.
     *
     * @param User $user
     * @return \Quiz\Commands\Site\ShowUserAvatar
     */
	public function __construct(User $user)
	{
        $this->user = $user;
    }

}
