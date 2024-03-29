<?php namespace Quiz\Http\Controllers;

use ClassesWithParents\G;
use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;

use Quiz\Models\User;
use Quiz\Models\Video;
use Quiz\Services\Leecher\MedVid\GetVideoInfo;
use Illuminate\Cache\Repository as Cache;
use Quiz\Services\Leecher\MedVid\GetVideoLink;

class TestController extends Controller {
    /**
     * @var Cache
     */
    private $cache;
    /**
     * @var Video
     */
    private $video;

    /**
     * @param Cache $cache
     * @param Video $video
     */
    public function __construct(Cache $cache, Video $video)
    {
        $this->cache = $cache;
        $this->video = $video;
        $this->middleware('admin');
    }

    public function index(GetVideoLink $getLink, GetVideoInfo $getInfo)
    {
        set_time_limit(0);

        $baseUrl = 'http://www.medicalvideos.org/videos/load/recent/';

        for ($i=1; $i<10; $i++)
        {
            $videoList = \Cache::rememberForever("videoList{$i}", function() use ($baseUrl, $i, $getLink)
            {
                return $getLink->get($baseUrl.$i)->parse();
            });


            foreach ($videoList as $video)
            {
                if (!$this->saveVideo($getInfo, $video))
                    return;

                sleep(2);
            }
            sleep(10);

            echo "video list {$i} <br>";
        }
    }


    /**
     * @param GetVideoInfo $getInfo
     * @param $video
     * @param $user
     * @return boolean
     */
    private function saveVideo(GetVideoInfo $getInfo, $video)
    {
        $user = User::find(1);

        $info = \Cache::rememberForever("videoLink{$video['link']}", function () use ($video, $getInfo) {
            return $getInfo->get($video['link'])->parse();
        });

        $saveVideo = $this->video->find(array('source' => $video['link']));

        if ($saveVideo->isEmpty())
        {
            $saveVideo = new $this->video;

            $saveVideo->fill($info);
            $saveVideo->thumb = $video['thumb'];
            $saveVideo->source = $video['link'];

            $saveVideo->user()->associate($user);
            $saveVideo->save();

            if (!empty($info['tag']))
                $saveVideo->retag($info['tag']);

            return true;
        }

        return false;
    }


    /**
     * Demo class function usage
     *
     * @param GetVideoLink $data
     * @return array|GetVideoLink
     */
    public function getVideoLink(GetVideoLink $data)
    {
        $link = 'http://www.medicalvideos.org/videos/load/recent/410';

        $data = $data->get($link)->parse();

        return $data;
    }

    /**
     * Demo class function usage
     *
     * @param GetVideoInfo $data
     * @return array|GetVideoInfo
     */
    public function getVideoInfo(GetVideoInfo $data)
    {
        $link = 'http://www.medicalvideos.org/videos/86/examination-of-an-enucleated-socket';

        $data = $data->get($link)->parse();

        return $data;
    }

}
