<?php namespace Quiz\Services\Leecher\MedVid;

use GuzzleHttp\Client;
use Illuminate\Cache\Repository as Cache;
use Sunra\PhpSimple\HtmlDomParser;

class GetVideoLink {
    /**
     * @var Client
     */
    private $client;


    private $body;
    /**
     * @var HtmlDomParser
     */
    private $parser;


    /**
     * @param Client $client
     * @param Cache $cache
     * @param HtmlDomParser $parser
     * @internal param $link
     */
    public function __construct(Client $client, HtmlDomParser $parser)
    {
        $this->client = $client;
        $this->parser = $parser;
    }


    /**
     * @param $link
     * @return $this
     */
    public function get($link)
    {
        $response = $this->client->get($link);

        $this->body = $response->getBody();

        return $this;
    }

    /**
     * @return array
     */
    public function parse()
    {
        $html = $this->parser->str_get_html($this->body);

        $list = $html->find('div[id=content-list]');

        $data = [];
        foreach ($list as $node)
        {
            $data[] = $this->parseInfo($node);
        }

        return $data;

    }

    private function parseInfo($node)
    {
        $node = $node->find('ul[class=content-list-thumb]', 0)->find('li',0)->find('a',0);

        $link = $node->href;
        $img = $node->find('img',0)->src;

        $data = [
            'link' => $link,
            'thumb' => $img,
        ];

        return $this->serialize($data);

    }

    /**
     * Return absolute url
     *
     * @param $data
     * @return mixed
     */
    public function serialize($data)
    {
        foreach ($data as $key => $d)
        {
            $data[$key] = 'http://www.medicalvideos.org/'.trim($d);
        }

        return $data;
    }
}