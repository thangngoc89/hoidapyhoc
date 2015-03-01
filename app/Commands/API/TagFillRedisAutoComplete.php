<?php namespace Quiz\Commands\API;

use Quiz\Commands\Command;

use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldBeQueued;

class TagFillRedisAutoComplete extends Command implements ShouldBeQueued {

	use InteractsWithQueue, SerializesModels;
    /**
     * @var
     */
    public $sortedSetName;

    /**
     * Create a new command instance.
     *
     * @param string $sortedSetName
     * @return \Quiz\Commands\API\TagFillRedisAutoComplete
     */
	public function __construct($sortedSetName)
	{
        $this->sortedSetName = $sortedSetName;
    }

}
