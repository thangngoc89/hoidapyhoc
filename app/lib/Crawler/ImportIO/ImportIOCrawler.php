<?php
namespace Quiz\lib\Crawler\ImportIO;

use GuzzleHttp\Client;
use Quiz\lib\Crawler\Crawler;

abstract class ImportIOCrawler extends Crawler
{

    protected $postBody;
    protected $userId = '163d8f4e-b65b-49df-8149-d7c0456dc9b9';
    protected $apikey;

    public function __construct()
    {
        $this->apikey = config('services.importIo.api_key');
    }

    /**
     * @param $dataSetId
     * @return $this
     */
    protected function set($dataSetId, array $headers = [], array $query = [])
    {
        $parameters = [
            'base_url' => ['https://api.import.io/store/data/{dataSetId}/_query', ['dataSetId' => $dataSetId]],
            'defaults' => [
                'query'   => array_merge([
                    '_user' => $this->getUserId(),
                    '_apikey' => $this->getApiKey(),
                ],$query),
                'headers' => array_merge([
                    'Accept'     => 'application/json',
                ], $headers),
            ],
        ];

        $this->guzzle = new Client($parameters);

        return $this;
    }

    /**
     * @return mixed
     */
    protected function get()
    {
        $response = $this->guzzle->post('', [
            'json' => $this->getPostBody()
        ]);

        return $response->json();
    }

    /**
     * @return string
     */
    public function getUserId()
    {
        return $this->userId;
    }


    /**
     * @param string $userId
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;

        return $this;
    }

    abstract public function setPostBody();

    /**
     * @return array
     */
    public function getPostBody()
    {
        if ( ! is_array($this->postBody) )
        {
            throw new \BadMethodCallException('Post Body must be an array');
        }

        return $this->postBody;
    }


    /**
     * @param string $apikey
     */
    public function setApikey($apikey)
    {
        $this->apikey = $apikey;
    }

    /**
     * @return string
     */
    public function getApikey()
    {
        if ( ! $this->apikey )
        {
            throw new \BadMethodCallException('No API Key Define');
        }

        return $this->apikey;
    }

} 