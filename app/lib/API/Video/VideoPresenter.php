<?php namespace Quiz\lib\API\Video;

use Laracasts\Presenter\Presenter;

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
     * Return meta description SEO tag
     *
     * @return string
     */
    public function source(ShortenInterface)
    {
        $parsedLink = parse_url($this->source);

        $host = $parsedLink['host'];

        $shortLink =
        return "<a href='$host'>{{ $video->source }}</a>";

    }

}