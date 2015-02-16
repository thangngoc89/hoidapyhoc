<?php namespace Quiz\Handlers\Events;

use Illuminate\Http\Request;
use Illuminate\Session\Store;
use Quiz\Events\Exam\ExamViewEvent;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldBeQueued;
use Quiz\Events\Video\VideoViewEvent;

class IncreaseViewCount {
    /**
     * @var Store
     */
    private $session;

    /**
     * Create the event handler.
     *
     * @param Store $session
     * @param $key
     * @return \Quiz\Handlers\Events\IncreaseViewCount
     */
	public function __construct(Store $session)
	{
        $this->session = $session;
    }

	/**
	 * Handle the event.
	 *
	 * @param  ExamViewEvent $event
	 * @return void
	 */
	public function handle($event)
	{
        // Set the related key
        $path = $event->request->path();
        // Serialize the array key for security
        $path = preg_replace("/[^a-zA-Z0-9]+/", "", $path);

        $object = $this->getObject($event);

        if ( ! $this->isPostViewed($path))
        {
            // Increment the view counter by one...
            $object->increment('views');

            // Update model
            $object->views += 1;

            $this->storePost($path);
        }
    }

    private function isPostViewed($path)
    {
        $viewed = $this->session->get('viewed_array', []);

        // Check if the post id exists as a key in the array.
        return array_key_exists($path, $viewed);
    }

    private function storePost($path)
    {
        // First make a key that we can use to store the timestamp
        // in the session. Laravel allows us to use a nested key
        // so that we can set the post id key on the viewed_posts
        // array.
        $key = 'viewed_array.' . $path;

        // Then set that key on the session and set its value
        // to the current timestamp.
        $this->session->put($key, time());
    }

    private function getObject($event)
    {
        if ($event instanceof ExamViewEvent)
            return $event->exam;

        if ($event instanceof VideoViewEvent)
            return $event->video;

        throw new \Exception ('Don\'t know how to increase count on this object');
    }

}
