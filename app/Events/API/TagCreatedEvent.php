<?php namespace Quiz\Events\API;

use Quiz\Events\Event;

use Illuminate\Queue\SerializesModels;
use Quiz\Models\Tag;

class TagCreatedEvent extends Event {

	use SerializesModels;
    /**
     * @var Tag
     */
    public $tag;

    /**
     * Create a new event instance.
     *
     * @param Tag $tag
     * @return \Quiz\Events\API\TagCreatedEvent
     */
	public function __construct(Tag $tag)
	{
        $this->tag = $tag;
    }

}
