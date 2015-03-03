<?php namespace Quiz\Handlers\Events\API;

use Quiz\Events\API\TagCreatedEvent;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldBeQueued;
use Redis;

class PushNewTagToRedisAutoComplete implements ShouldBeQueued {

    private $redis;

    private $redisCard;
	/**
	 * Create the event handler.
	 *
	 * @return void
	 */
	public function __construct()
	{
        $this->redis = Redis::connection();
	}

	/**
	 * Handle the event.
	 *
	 * @param TagCreatedEvent $event
	 * @return void
	 */
	public function handle(TagCreatedEvent $event)
	{
		$tag = $event->tag;

        $this->setRedisCard(config('tagging.redisCard'));

        $score = '0';
        $member = $tag->slug.":".$tag->name;
        $this->redis->zadd($this->getRedisCard(), $score, $member);
	}

    /**
     * @param mixed $redisCard
     */
    public function setRedisCard($redisCard)
    {
        $this->redisCard = $redisCard;
    }

    /**
     * @return mixed
     */
    public function getRedisCard()
    {
        return $this->redisCard;
    }

}
