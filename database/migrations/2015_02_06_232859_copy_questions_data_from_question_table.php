<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Quiz\Models\Exam;

class CopyQuestionsDataFromQuestionTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        $exams = Exam::all();

        DB::beginTransaction();

            foreach ($exams as $exam)
            {
                $this->copy($exam);
            }

        DB::commit();

	}

    public function copy(Exam $exam)
    {
        $questions = $exam->question;

        $jsonData = $this->questionsToJson($questions);

//        dd($jsonData);
        $exam->questions = json_encode($jsonData);
        $exam->questions_count = $questions->count();

        $exam->save();
    }

    /**
     * @param $questions
     * @return array
     */
    public function questionsToJson($questions)
    {
        $data = array();
        foreach($questions as $q)
        {
            $data[] = [
                'answer' => $q->right_answer,
                'content' => $q->content
            ];
        }

        return $data;
    }

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		//
	}

}
