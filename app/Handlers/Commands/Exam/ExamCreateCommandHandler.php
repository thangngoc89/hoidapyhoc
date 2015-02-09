<?php namespace Quiz\Handlers\Commands\Exam;

use Quiz\Commands\Exam\ExamCreateCommand;

use Illuminate\Queue\InteractsWithQueue;
use Quiz\Exceptions\ExamSaveException;
use Quiz\Events\Exam\ExamCreatedEvent;
use Quiz\Models\Exam;
use Quiz\Models\Question;

class ExamCreateCommandHandler {

    /**
     * Create the command handler.
     *
     * @param array $attributes
     * @return \Quiz\Handlers\Commands\Exam\ExamCreateCommandHandler
     */
	public function __construct()
	{

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

        \DB::beginTransaction();

        try {

            $exam = new Exam($request->all());
            $exam->user_id = \Auth::user()->id;
            if (!$exam->save())
                throw new ExamSaveException ("Could not save exam");

            $exam->tag($request->tags);

        } catch (\Exception $e) {

            \DB::rollback();

            return false;
        }

        \DB::commit();

        event( new ExamCreatedEvent($exam) );

        return $exam;
	}

}
