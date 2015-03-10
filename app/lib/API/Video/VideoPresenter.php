<?php namespace Quiz\lib\API\Video;

use Laracasts\Presenter\Presenter;
use Quiz\lib\ExternalLink\Shorten\ShortenInterface;

class VideoPresenter extends Presenter {

    /**
     * Generate self link (and edit link as well)
     *
     * @param null $type
     * @return string
     */
    public function link($type = null)
    {
        if ($type == 'edit')
            return '/quiz/'.$this->id.'/edit';

        return '/quiz/lam-bai/'.$this->slug.'/'.$this->id;
    }

    public function createdDate()
    {
        return $this->created_at->diffForHumans();
    }

    /**
     * Return a nice source link
     *
     * @return string
     */
    public function source()
    {
        $parsedLink = parse_url($this->videoSource);

        $host = $parsedLink['host'];

        #TODO: Make this a non-blocking method
        try {
            $shortener = \App::make(ShortenInterface::class);
            $shortenLink = $shortener->shorten($this->videoSource);
        } catch (\RuntimeException $e)
        {
            $shortenLink = $this->videoSource;
        }

        return "<a href='$shortenLink' target='_blank'>$host</a>";
    }

}