<?php namespace Quiz\lib\Repositories\Video;

use Quiz\lib\Repositories\AbstractEloquentRepository;
use Quiz\Models\Video;

class EloquentVideoRepository extends AbstractEloquentRepository implements VideoRepository {
    /**
     * @var Video
     */
    protected $model;

    /**
     * @param Video $model
     */
    public function __construct(Video $model)
    {
        $this->model = $model;
    }


    /**
     * Return an collection of related videos of given video id
     *
     * @param int || Video $video
     * @param int $amount
     */
    public function getRelatedVideosByTags($video, $amount = 6)
    {
        $video = $this->getItem($video);

        $video->load(['tagged.videos' => function ($q) use ( &$relatedVideos, $video, $amount ) {
            $relatedVideos = $q->where('videos.id', '<>', $video->id)->limit($amount)->get()->unique();
        }]);

        $count = $relatedVideos->count();
        if ($count < $amount)
        {
            $currentIds = $relatedVideos->lists('id');
            $currentIds []= $video->id;

            $moreRelatedVideos = $this->video->whereRaw('RAND()')->whereNotIn('id',$currentIds)->take($amount-$count)->get();
            $relatedVideos = $relatedVideos->merge($moreRelatedVideos);
        }
    }

    private function getItem($video)
    {
        if ($video instanceof Video)
            return $video;

        return $this->model->find($video);
    }


}