<?php namespace Quiz\Handlers\Commands\Exam;

use Quiz\Commands\Exam\ExamUpdateCommand;

use Illuminate\Queue\InteractsWithQueue;
use Quiz\Events\Exam\ExamUpdatedEvent;
use Quiz\Exceptions\ApiException;
use Quiz\Exceptions\ExamSaveException;
use Quiz\Models\Exam;

class ExamUpdateCommandHandler {

	/**
	 * Create the command handler.
	 *
	 * @return void
	 */
	public function __construct()
	{
		//
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

        \DB::beginTransaction();

        try {

            $exam->fill($request->all());

            $exam->user_id_edited = \Auth::user()->id;

            if (count($request->questions) != $exam->questions_count)
                throw new ApiException ("Questions are not equal");

            if (!$exam->save())
                throw new ApiException ("Can not update exam");

            $exam->retag($request->tags);

       } catch (\Exception $e) {

            \DB::rollback();

            return false;
        }

        \DB::commit();

        event( new ExamUpdatedEvent($exam));

        return $exam;
	}

}
