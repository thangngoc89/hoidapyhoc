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

            if (!$exam->save())
                throw new ExamSaveException ("Could not save exam");

            $exam->tag($request->tags);

            $this->storeQuestion($request, $exam->id);

        } catch (\Exception $e) {

            \DB::rollback();

            return false;
        }

        \DB::commit();

        event( new ExamCreatedEvent($exam) );

        return $exam;
	}

    public function storeQuestion($request, $examId)
    {
        foreach ($request->questions as $q)
        {
            $question = new Question($q);
            $question->test_id = $examId;
            if (!$question->save())
                throw new ExamSaveException ("Could not save exam");
        }
    }

}
