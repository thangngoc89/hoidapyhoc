<?php namespace Quiz\Handlers\Commands\Exam;

use Illuminate\Auth\Guard;
use Quiz\Commands\Exam\ExamUpdateCommand;

use Illuminate\Queue\InteractsWithQueue;
use Quiz\Events\Exam\ExamUpdatedEvent;
use Quiz\Exceptions\ApiException;
use Quiz\Exceptions\ExamSaveException;
use Quiz\Models\Exam;

class ExamUpdateCommandHandler {
    /**
     * @var Guard
     */
    private $auth;

    /**
     * Create the command handler.
     *
     * @param Guard $auth
     * @return \Quiz\Handlers\Commands\Exam\ExamUpdateCommandHandler
     */
	public function __construct(Guard $auth)
	{
        $this->auth = $auth;
    }

	/**
	 * Handle the command.
	 *
	 * @param  ExamUpdateCommand  $command
	 * @return \Quiz\Models\Exam
     *
	 */
	public function handle(ExamUpdateCommand $command)
	{
        $request = $command->request;
        $exam = $command->exam;

        $exam->fill($request->all());

        $exam->user_id_edited = $this->auth->user()->id;

        if (count($request->questions) != $exam->questions_count)
            throw new ApiException ("Questions are not equal");

        if (!$exam->save())
            throw new ApiException ("Can not update exam");

        $exam->retag($request->tags);

        event( new ExamUpdatedEvent($exam));

        return $exam;
	}

}
