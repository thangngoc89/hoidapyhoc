<?php namespace Quiz\lib\API\Exam;

use Quiz\Models\Exam;
use Quiz\Models\History;

class TestCheckSaver
{
    /**
     * @var Exam
     */
    private $test;


    /**
     * @param array $attributes
     * @param Exam $test
     */
    public function __construct(array $attributes,Exam $test)
    {
        $this->attributes = $attributes;
        $this->test = $test;
    }

    /**
     * @return bool|\Illuminate\Support\Collection|null|static
     * @throws \Exception
     */
    public function save()
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
        else
            throw new \Exception ('ErrorWhenSavingAnswer');

    }
}