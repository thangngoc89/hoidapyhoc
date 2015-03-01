<?php namespace Quiz\Handlers\Commands\API;

use Quiz\Commands\API\TagFillRedisAutoComplete;

use Illuminate\Queue\InteractsWithQueue;
use Quiz\lib\Repositories\Tag\TagRepository;
use Redis;

class TagFillRedisAutoCompleteHandler {
    /**
     * @var TagRepository
     */
    private $tag;

    /**
     * Create the command handler.
     *
     * @param TagRepository $tag
     * @return \Quiz\Handlers\Commands\API\TagFillRedisAutoCompleteHandler
     */
	public function __construct(TagRepository $tag)
	{
        $this->tag = $tag;
    }

	/**
	 * Handle the command.
	 *
	 * @param  TagFillRedisAutoComplete  $command
	 * @return void
	 */
	public function handle(TagFillRedisAutoComplete $command)
	{
		$sortedSetName = $command->sortedSetName;

        $tags = $this->tag->orderBy('name')->get('name');

        Redis::pipeline(function($pipe) use ($sortedSetName, $tags)
        {
            foreach ($tags as $tag)
            {
                $score = '0';
                $member = $tag->name;
                $pipe->zadd($sortedSetName, $score, $member);
            }
        });
	}

}
