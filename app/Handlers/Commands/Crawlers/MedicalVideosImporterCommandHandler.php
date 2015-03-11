<?php namespace Quiz\Handlers\Commands\Crawlers;

use Quiz\Commands\Crawlers\MedicalVideosImporterCommand;

use Illuminate\Queue\InteractsWithQueue;
use Quiz\lib\Crawlers\ImportIO\MedVidCrawler;
use Quiz\lib\Repositories\Video\VideoRepository;

class MedicalVideosImporterCommandHandler {

    private $dataSetId;
    /**
     * @var MedVidCrawler
     */
    private $crawler;
    /**
     * @var VideoRepository
     */
    private $video;

    /**
     * Create the command handler.
     *
     * @param MedVidCrawler $crawler
     * @param VideoRepository $video
     * @return \Quiz\Handlers\Commands\Crawlers\MedicalVideosImporterCommandHandler
     */
	public function __construct(MedVidCrawler $crawler, VideoRepository $video)
	{
        $dataSetId = config('quiz.crawler.importIO.med_vid_single_data');
		$this->setDataSetId($dataSetId);
        $this->crawler = $crawler;
        $this->video = $video;
    }

	/**
	 * Handle the command.
	 *
	 * @param  MedicalVideosImporterCommand  $command
	 * @return void
	 */
	public function handle(MedicalVideosImporterCommand $command)
	{
        #TODO: Investigate about batch run of Import IO

		$result = $command->result;

        $videoLink = $result['video_link/_source'];
        $videoLink = $this->getAbsoluteUrl($videoLink);

        $video_embed = $this->crawler
            ->setLink($videoLink)
            ->setDataSetId($this->getDataSetId())
            ->execute();

        $rawData = array_merge($result, $video_embed['results'][0]);

        $formatedData = $this->formatData($rawData);

        $this->saveVideoToDatabase($formatedData);

        $this->logInfomation($formatedData);
    }

    /**
     * @param string $relativeUrl
     */
    private function getAbsoluteUrl($relativeUrl)
    {
        return config('quiz.crawler.importIO.med_vid_base_url') . $relativeUrl;
    }

    /**
     * @return string
     */
    public function getDataSetId()
    {
        if ( ! $this->dataSetId )
        {
            throw new \BadMethodCallException('You have to set Data set ID');
        }

        return $this->dataSetId;
    }

    /**
     * @param string $dataSetId
     */
    public function setDataSetId($dataSetId)
    {
        $this->dataSetId = $dataSetId;
    }

    private function formatData($rawData)
    {
        return [
            'title' => $rawData['image/_title'],
            'link' =>  $this->getVideoLinkFromEmbed($rawData['embed']),
            'thumb' => $this->getAbsoluteUrl($rawData['image/_source']),
            'description' => $rawData['description'],
            'source' => $this->getAbsoluteUrl($rawData['video_link/_source']),
            'duration' => $this->getDuration($rawData['duration']),
            'tags'  => trim($rawData['channel']),
        ];
    }

    /**
     * @param $embed
     * @return string
     */
    private function getVideoLinkFromEmbed($embed)
    {
        $embed = html_entity_decode($embed);

        $embedValue = explode(' value="', $embed)[1];
        $embedValue = html_entity_decode($embedValue);

        $link = explode('"file=', $embedValue)[1];
        $link = explode('&sharing.link=', $link)[0];

        return $link;
    }

    /**
     * @param $duration
     * @return int $toSeconds
     */
    private function getDuration($duration)
    {
        $duration = explode('(', $duration)[2];
        $duration = str_replace(')','',$duration);

        list($hours, $minutes, $seconds) = explode(':', $duration);

        $toSeconds = (int) $hours * 60 * 60 + (int) $minutes * 60 + (int) $seconds;

        return $toSeconds;
    }

    /**
     * @param $formatedData
     */
    private function saveVideoToDatabase($formatedData)
    {
        $video = $this->video->create($formatedData);

        if ($tags = $formatedData['tags']) {
            $video->tag($tags);
        }
    }

    /**
     * @param $formatedData
     */
    private function logInfomation($formatedData)
    {
        \Log::info('Imported Video ', $formatedData);
    }

}
