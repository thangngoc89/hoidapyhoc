<?php namespace Quiz\Handlers\Commands\Exam;

use Quiz\Commands\Exam\ExamCheckCommand;

use Illuminate\Queue\InteractsWithQueue;

class ExamCheckCommandHandler {

	/**
	 * Create the command handler.
	 *
	 * @return void
	 */
	public function __construct()
	{

	}

	/**
	 * Handle the command.
	 *
	 * @param  ExamCheckCommand  $command
	 * @return void
	 */
	public function handle(ExamCheckCommand $command)
	{
        $user = \Auth::user();
        $history = History::find($this->attributes['user_history_id']);
        if (is_null($history))
            abort(404);
        if ($history->user_id != $user->id)
            throw new \Exception ('Don\'t cheat man');
        $givenAnswer = $this->attributes['answers'];
        $score = 0;
        $answerString = '';
        $map = ['_','A','B','C','D','E'];
        foreach ($this->test->question as $index => $q)
        {
            $answer = $map[$givenAnswer[$index]];
            $answerString .= $answer;
            if ($q->right_answer == $answer)
                $score++;
        }
        $history->score = $score;
        $history->answer = $answerString;
        $history->isDone = true;

        if ($history->save())
            return $history;

        throw new \Exception ('ErrorWhenSavingAnswer');
    }
}
