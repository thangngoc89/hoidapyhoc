<?php
namespace Quiz\lib\Crawler;

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
        return $this->link;
    }

    /**
     * @param mixed $link
     */
    public function setLink($link)
    {
        $this->link = $link;
    }

}