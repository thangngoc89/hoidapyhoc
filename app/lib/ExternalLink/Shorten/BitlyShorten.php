<?php
namespace Quiz\lib\ExternalLink\Shorten;

use Hpatoio\Bitly\Client;
use Quiz\lib\ExternalLink\Shorten\ShortenInterface as BaseShorten;
use Cache;
use Quiz\lib\Helpers\Str;

class BitlyShorten implements BaseShorten
{
    protected $bitly;

    public function __construct()
    {
        $access_token = config('services.bitly.access_token');
        $this->bitly = new Client($access_token);
    }

    /**
     * Generate a custom shorten url of given link with optional custom url
     *
     * @param $link
     * @param bool $customUrl
     * @return mixed
     */
    public function shorten($link, $customUrl = false)
    {
        $key = md5('shorten_links_' . $link);

        if (Cache::driver('file')->has($key))
            return Cache::driver('file')->get($key);

        $shortenLink = $this->getShortenLinkFromServer($link);

        Cache::driver('file')->forever($key, $shortenLink);

        return $shortenLink;
    }

    /**
     * Make the real request to bit.ly server
     *
     * @param string $link
     * @return string
     */
    private function getShortenLinkFromServer($link)
    {
        $response = $this->bitly->shorten(array("longUrl" => $link));

        $shortenLink = $response['url'];
        return $shortenLink;
    }
}