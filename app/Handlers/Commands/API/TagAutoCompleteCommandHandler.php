<?php namespace Quiz\Handlers\Commands\API;

use Quiz\Commands\API\TagAutoCompleteCommand;
use Illuminate\Queue\InteractsWithQueue;
use Quiz\Commands\API\TagFillRedisAutoComplete;
use Quiz\lib\Repositories\Tag\TagRepository;
use Redis;
use Illuminate\Foundation\Bus\DispatchesCommands;

class TagAutoCompleteCommandHandler {

    use DispatchesCommands;

    private $query;
    private $redis;
    private $result;
    private $limit = 10;
    private $redisCard;
    /**
     * @var TagRepository
     */
    private $tag;

    /**
     * Create the command handler.
     *
     * @param TagRepository $tag
     * @internal param $redis
     * @return \Quiz\Handlers\Commands\API\TagAutoCompleteCommandHandler
     */
	public function __construct(TagRepository $tag)
	{
        $this->redis = Redis::connection();
        $this->tag = $tag;
    }

	/**
	 * Handle the command.
	 *
	 * @param  TagAutoCompleteCommand  $command
	 * @return array
	 */
	public function handle(TagAutoCompleteCommand $command)
	{
		$this->setQuery($command->query);

        $this->setRedisCard(config('tagging.redisCard'));

        $this->selectMethod();

        return $this->result;
	}

    private function selectMethod()
    {
        $count = $this->redis->zcard($this->redisCard);

        if ($count)
        {
            $this->getResultFromRedis();
        }
        else
        {
            $this->dispatch( new TagFillRedisAutoComplete($this->getRedisCard()) );
            $this->getResultFromDB();
        }
    }

    /**
     * @param string $query
     * @return void
     */
    private function setQuery($query)
    {
        $this->query = $query;
    }

    /**
     * Make slug
     *
     * @param $query
     */
    private function serializeQueryForRedis()
    {
        $this->query = call_user_func(config('tagging.normalizer'), $this->query);
    }

    /**
     * Make a displayer Str::title
     *
     * @param $query
     */
    private function serializeQueryForDb()
    {
        $this->query = call_user_func(config('tagging.displayer'), $this->query);
    }

    /**
     * @return void
     */
    private function getResultFromRedis()
    {
        $this->serializeQueryForRedis();

        $limit = (string) $this->limit;
        $query = $this->query;

        $this->result = $this->redis->zrangebylex($this->getRedisCard(),"[$query","[$query\xff",["LIMIT","0",$limit]);
    }

    /**
     * @return void
     */
    private function getResultFromDB()
    {
        $this->serializeQueryForDb();

        $this->result = $this->tag->search($this->query)
                            ->take($this->limit)
                            ->get()
                            ->toArray();
    }

    /**
     * @return mixed
     */
    public function getRedisCard()
    {
        return $this->redisCard;
    }

    /**
     * @param mixed $redisCard
     */
    public function setRedisCard($redisCard)
    {
        $this->redisCard = $redisCard;
    }

}
