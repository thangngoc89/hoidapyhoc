<?php namespace Quiz\Commands\Crawlers;

use Quiz\Commands\Command;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldBeQueued;

class MedicalVideosImporterCommand extends Command implements ShouldBeQueued
{

	use InteractsWithQueue;
    /**
     * @var
     */
    public $result;

    /**
     * Create a new command instance.
     *
     * @param array $result
     * @return \Quiz\Commands\Crawlers\MedicalVideosImporterCommand
     */
	public function __construct($result)
	{
        $this->result = $result;
    }

}
