<?php
namespace Quiz\lib\ExternalLink\Shorten;

interface ShortenInterface
{
    /**
     * Generate a custom shorten url of given link with optional custom url
     *
     * @param $link
     * @param bool $customUrl
     * @return mixed
     */
    public function shorten($link, $customUrl = false);
} 