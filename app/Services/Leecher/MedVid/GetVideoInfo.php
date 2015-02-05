<?php namespace Quiz\Services\Leecher\MedVid;

use GuzzleHttp\Client;
use Illuminate\Cache\Repository as Cache;
use Sunra\PhpSimple\HtmlDomParser;


class GetVideoInfo {
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

    public function get($link)
    {
        $response = $this->client->get($link);

        $this->body = $response->getBody();

        return $this;
    }

    public function parse()
    {
        $html = $this->parser->str_get_html($this->body);

        $videoLink = $this->parseVideoLink($html);
        $info = $this->parseInfo($html);

        return array_merge($videoLink, $info);

    }

    /**
     * Parse Video *.mp4 link from response
     * @param array
     */
    private function parseVideoLink($html)
    {
        $embedValue = $html->find('input[name=embedded]',0)->value;
        $embedValue = html_entity_decode($embedValue);

        $link = explode('"file=', $embedValue)[1];
        $link = explode('&sharing.link=', $link)[0];

        return ['link' => $link];
    }

    private function parseInfo($html)
    {
        $listTree = $html->find('ul[class=video-details-list]', 0)->find('li');

        $channel = $listTree[3]->plaintext;
        $channel = str_replace('Channel:&nbsp;&nbsp;','',$channel);

        $title = $listTree[2]->plaintext;
        $title = str_replace('Medical Video Title:&nbsp;&nbsp;','', $title);
        $title = str_replace('</a>','', $title);

        $desc = $listTree[4]->plaintext;
        $desc = str_replace('This Medical Video:&nbsp;&nbsp;','', $desc);

        $tag = $listTree[5]->plaintext;
        $tag = str_replace('Tags:&nbsp;&nbsp;','', $tag);

        $data = [
            'title' => $title,
            'description' => $desc,
            'tag' => $tag.$channel,
        ];

        return $this->serialize($data);
    }

    public function serialize($data)
    {
        foreach ($data as $key => $d)
        {
            $data[$key] = trim($d);
        }

        return $data;
    }
}