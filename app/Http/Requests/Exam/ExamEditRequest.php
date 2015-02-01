<?php namespace Quiz\Http\Requests\Exam;

use Illuminate\Contracts\Auth\Guard;
use Quiz\Http\Requests\Request;
use Quiz\lib\Repositories\Exam\ExamRepository;

class ExamEditRequest extends Request {
    /**
     * @var ExamRepository
     */
    private $exam;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @param ExamRepository $exam
     * @return \Quiz\Http\Requests\Exam\ExamEditRequest
     */
    public function __construct(ExamRepository $exam)
    {
        $this->exam = $exam;
    }

	public function authorize(Guard $auth)
	{
        if (!$auth->check())
            return false;

        $user = $auth->user();
        $exam = $this->getExam();

        if ($user->id != $exam->user_id && !$user->can('manage_exams'))
            return false;

        return true;
	}


	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
        $exam = $this->getExam();

        return [
            'name' => 'required|min:6|unique:tests,id,'.$exam->id,
            'thoigian' => 'required|integer|between:5,200',
            'content' => 'required',
            'begin' => 'required|integer|min:1',
            'tags'   => 'required',
            'questions' => 'required|array'
        ];

	}

    /**
     * @return mixed
     */
    private function getExam()
    {
        $examId = $this->segment(4);
        $exam = $this->exam->find($examId);
        return $exam;
    }

}
