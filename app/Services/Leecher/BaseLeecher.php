<?php namespace Quiz\Services\Leecher;

use GuzzleHttp\Client;
use Illuminate\Cache\Repository as Cache;
use Sunra\PhpSimple\HtmlDomParser;

class BaseLeecher {
    /**
     * @var Client
     */
    protected $client;
    /**
     * @var HtmlDomParser
     */
    protected $parser;

    /**
     * @param Client $client
     * @param HtmlDomParser $parser
     */
    public function __construct(Client $client, HtmlDomParser $parser)
    {
        $this->client = $client;
        $this->parser = $parser;
    }

} 