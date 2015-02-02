<?php namespace Quiz\Handlers\Commands\Exam;

use Quiz\Commands\Exam\ExamUpdateCommand;

use Illuminate\Queue\InteractsWithQueue;
use Quiz\Events\Exam\ExamUpdatedEvent;
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

            if (count($request->questions) != $exam->question->count())
                throw new ExamSaveException ("Questions are not equal");

            if (!$exam->save())
                throw new ExamSaveException ("Can not update exam");

            $exam->retag($request->tags);

            $this->editQuestion($exam, $request);

            return $exam;

        } catch (\Exception $e) {

            \DB::rollback();

            return false;
        }

        \DB::commit();

        event( new ExamUpdatedEvent($exam));

        return $exam;
	}

    public function editQuestion(Exam $exam, $request)
    {
        $questions = $exam->question();

        $givenQuestions = $request->questions;

        foreach ($questions as $key => $q)
        {
            $updateData = $givenQuestions[$key];

            $q->fill($updateData);

            if (!$q->save())
                throw new \Exception ("Can not update question");
        }
    }


}
