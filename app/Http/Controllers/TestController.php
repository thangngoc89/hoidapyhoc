<?php namespace Quiz\Http\Controllers;

use ClassesWithParents\G;
use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;

use Quiz\Services\Leecher\MedVid\GetVideoInfo;
use Illuminate\Cache\Repository as Cache;
use Quiz\Services\Leecher\MedVid\GetVideoLink;

class TestController extends Controller {
    /**
     * @var Cache
     */
    private $cache;

    /**
     * @param Cache $cache
     */
    public function __construct(Cache $cache)
    {
        $this->cache = $cache;
    }

    public function index(GetVideoLink $data)
    {
        $link = 'http://www.medicalvideos.org/videos/load/recent/410';

        $data = $data->get($link)->parse();

        dd($data);

    }

	public function getVideoInfo(GetVideoInfo $data)
	{
        $link = 'http://www.medicalvideos.org/videos/86/examination-of-an-enucleated-socket';

        $data = $data->get($link)->parse();

        return $data;
	}



}
