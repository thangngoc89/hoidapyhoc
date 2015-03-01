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
    private $redisCard = 'tags_complete';
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
            $this->dispatch( new TagFillRedisAutoComplete($this->redisCard) );
            $this->getResultFromDB();
        }
    }

    /**
     * @param string $query
     * @return void
     */
    private function setQuery($query)
    {
        // Normalize query string
        $query = call_user_func(config('tagging.displayer'), $query);

        // Set query string
        $this->query = $query;
    }

    /**
     * @return void
     */
    private function getResultFromRedis()
    {
        $limit = (string) $this->limit;
        $query = $this->query;

        $this->result = $this->redis->zrangebylex($this->redisCard,"[$query","[$query\xff",["LIMIT","0",$limit]);
    }

    /**
     * @return void
     */
    private function getResultFromDB()
    {
        $this->result = $this->tag->search($this->query)
                            ->take($this->limit)
                            ->get()
                            ->toArray();
    }

}
