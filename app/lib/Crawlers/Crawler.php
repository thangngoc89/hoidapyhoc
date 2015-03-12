<?php
namespace Quiz\lib\Crawlers;

class Crawler
{
    protected $guzzle;
    protected $body;
    protected $link;

    /**
     * @return mixed
     */
    public function getLink()
    {
        if ( ! $this->link )
        {
            throw new \BadMethodCallException('Link can not be null');
        }
        return $this->link;
    }

    /**
     * @param mixed $link
     */
    public function setLink($link)
    {
        $this->link = $link;

        return $this;
    }

}