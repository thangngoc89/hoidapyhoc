<?php namespace Quiz\Handlers\Commands\Exam;

use Illuminate\Contracts\Auth\Guard;
use Quiz\Commands\Exam\ExamCheckCommand;

use Illuminate\Queue\InteractsWithQueue;
use Quiz\Exceptions\ExamSaveException;
use Quiz\Models\History;

class ExamCheckCommandHandler {
    /**
     * @var Guard
     */
    private $auth;
    /**
     * @var History
     */
    private $history;

    /**
     * Create the command handler.
     *
     * @param Guard $auth
     * @param History $history
     * @return \Quiz\Handlers\Commands\Exam\ExamCheckCommandHandler
     */
	public function __construct(Guard $auth, History $history)
    {
        $this->auth = $auth;
        $this->history = $history;
    }

	/**
	 * Handle the command.
	 *
	 * @param  ExamCheckCommand  $command
	 * @return \Quiz\Models\History
	 */
	public function handle(ExamCheckCommand $command)
	{
        $user = $this->auth->user();

        $request = $command->request;
        $exam = $command->exam;

        $history = $this->history->find($request->user_history_id);

        if (is_null($history)) abort(404);

        if ($history->user_id != $user->id)
            throw new \Exception ('Don\'t cheat man');

        $givenAnswer = $request->answers;
        $score = 0;
        $answerString = '';
        $map = ['_','A','B','C','D','E'];

        foreach ($exam->question as $index => $q)
        {
            $answer = $map[$givenAnswer[$index]];
            $answerString .= $answer;
            if ($q->right_answer == $answer)
                $score++;
        }

        $history->score = $score;
        $history->answer = $answerString;
        $history->isDone = true;

        if (!$history->save())
            throw new ExamSaveException ('Can not update history');

        return $history;

    }
}
