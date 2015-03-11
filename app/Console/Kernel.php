<?php namespace Quiz\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Quiz\Console\Commands\Crawlers\MedicalVideosCrawlerConsole;

class Kernel extends ConsoleKernel {

	/**
	 * The Artisan commands provided by your application.
	 *
	 * @var array
	 */
	protected $commands = [
		'Quiz\Console\Commands\Inspire',
        MedicalVideosCrawlerConsole::class,
	];

	/**
	 * Define the application's command schedule.
	 *
	 * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
	 * @return void
	 */
	protected function schedule(Schedule $schedule)
	{
//		$schedule->command('inspire')
//				 ->hourly();
        $schedule->command('backup:run')
                 ->dailyAt('23:00');
	}

}
