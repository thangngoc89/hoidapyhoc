<?php
namespace Quiz\lib\Crawler\ImportIO;

use GuzzleHttp\Exception\RequestException;

class MedVidCrawler extends ImportIOCrawler
{
    protected $link = 'http://www.medicalvideos.org/videos/load/recent/';
    protected $dataSetId = '087d429b-55dc-4236-b2c1-6a25f7bd4482';

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Send request and get result from ImportIO
     *
     * @return array
     */
    public function execute()
    {
        $dataSetId = $this->getDataSetId();

//        try {
//            $response = $this->setPostBody()->set($dataSetId)->get();
//        } catch (RequestException $e) {
//            echo $e->getRequest() . "\n";
//            if ($e->hasResponse()) {
//                echo $e->getResponse() . "\n";
//            }
//        }

        return $this->setPostBody()->set($dataSetId)->get();
    }

    public function setPostBody()
    {
        $this->postBody = [
            'input' => [
                'webpage/url' => $this->getLink()
            ],
        ];

        return $this;
    }

    /**
     * @return string
     */
    public function getDataSetId()
    {
        return $this->dataSetId;
    }

    /**
     * @param string $dataSetId
     */
    public function setDataSetId($dataSetId)
    {
        $this->dataSetId = $dataSetId;
    }

}