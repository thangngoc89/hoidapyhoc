<?php namespace Quiz\Console\Commands\Crawlers;

use Illuminate\Console\Command;
use Quiz\Commands\Crawlers\MedicalVideosImporterCommand;
use Quiz\lib\Crawlers\ImportIO\MedVidCrawler;
use Quiz\lib\Repositories\Video\VideoRepository;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;
use Illuminate\Contracts\Bus\Dispatcher;

class MedicalVideosCrawlerConsole extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'crawler:medvid';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Crawl Medical Videos newest videos.';
    /**
     * @var MedVidCrawler
     */
    protected $crawler;
    /**
     * @var Dispatcher
     */
    private $dispatcher;
    /**
     * @var VideoRepository
     */
    private $video;

    /**
     * Create a new command instance.
     *
     * @param MedVidCrawler $crawler
     * @param Dispatcher $dispatcher
     * @param VideoRepository $video
     * @return \Quiz\Console\Commands\Crawlers\MedicalVideosCrawlerConsole
     */
	public function __construct(MedVidCrawler $crawler, Dispatcher $dispatcher, VideoRepository $video)
	{
		parent::__construct();
        $this->crawler = $crawler;
        $this->dispatcher = $dispatcher;
        $this->video = $video;
    }

	/**
	 * Execute the console command.
	 *
	 * @return void
	 */
	public function fire()
	{
        $this->info('Crawling Medical Videos newest videos');

        $i = 1;
        $baseLink = 'http://www.medicalvideos.org/videos/load/recent/';

        do {

            if ( env('APP_DEBUG') == 'local')
            {
                $results = $this->crawler->setLink($baseLink.$i)->executeWithCache();
            } else {
                $results = $this->crawler->setLink($baseLink.$i)->execute();
            }

            $this->info('Crawled page ' . $i);

            $i++;

        } while ( $this->parseResult( $results ) );

        $this->info('All links are ready for be crawl. Remember to turn on queue');
	}

    private function parseResult($results)
    {
        foreach ( $results['results'] as $result)
        {
            $source_link = 'http://www.medicalvideos.org/' . $result['video_link/_source'];

            // If there is this video was crawled, stop right here
            if  ( $this->video->getFirstBy('source', $source_link) )
            {
                return false;
            }

            $this->dispatcher->dispatch( new MedicalVideosImporterCommand( $result ) );
        }

        // If return true, crawler will craw the next page
        return true;
    }

//	/**
//	 * Get the console command arguments.
//	 *
//	 * @return array
//	 */
//	protected function getArguments()
//	{
//		return [
//			['example', InputArgument::REQUIRED, 'An example argument.'],
//		];
//	}
//
//	/**
//	 * Get the console command options.
//	 *
//	 * @return array
//	 */
//	protected function getOptions()
//	{
//		return [
//			['example', null, InputOption::VALUE_OPTIONAL, 'An example option.', null],
//		];
//	}

}
