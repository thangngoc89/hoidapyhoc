<?php namespace Quiz\Handlers\Commands\Exam;

use Illuminate\Contracts\Auth\Guard;
use Quiz\Commands\Exam\ExamCreateCommand;

use Illuminate\Queue\InteractsWithQueue;
use Quiz\Exceptions\ApiException;
use Quiz\Events\Exam\ExamCreatedEvent;
use Quiz\Models\Exam;

class ExamCreateCommandHandler {
    /**
     * @var Guard
     */
    private $auth;

    /**
     * Create the command handler.
     *
     * @param Guard $auth
     * @internal param array $attributes
     * @return \Quiz\Handlers\Commands\Exam\ExamCreateCommandHandler
     */
	public function __construct(Guard $auth)
	{
        $this->auth = $auth;
    }

	/**
	 * Handle the command.
	 *
	 * @param  ExamCreateCommand  $command
	 * @return \Quiz\Models\Exam
	 */
	public function handle(ExamCreateCommand $command)
	{
        $request = $command->request;

        $exam = new Exam($request->all());
        $exam->user_id = $this->auth->user()->id;

        if (!$exam->save())
            throw new ApiException("Could not save exam");

        $exam->retag($request->tags);

        event( new ExamCreatedEvent($exam) );

        return $exam;
	}

}
