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


        if (is_null($relatedVideos))
        {
            $count = 0;
            $currentIds = [];
        } else {
            $count = $relatedVideos->count();
            $currentIds = $relatedVideos->lists('id');
        }
        if ($count < $amount)
        {
            $currentIds []= $video->id;

            $moreRelatedVideos = $this->model->orderByRaw('RAND()')->whereNotIn('id',$currentIds)->take($amount-$count)->get();
            $relatedVideos = is_null($relatedVideos) ? $moreRelatedVideos : $relatedVideos->merge($moreRelatedVideos);
        }


        return $relatedVideos;
    }

    private function getItem($video)
    {
        if ($video instanceof Video)
            return $video;

        return $this->model->find($video);
    }


}