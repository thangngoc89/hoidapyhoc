<?php namespace Quiz\lib\Repositories\Video;

use Quiz\lib\Repositories\BaseRepository;

interface VideoRepository extends BaseRepository {

    public function getRelatedVideosByTags($video, $amount = 6);

}