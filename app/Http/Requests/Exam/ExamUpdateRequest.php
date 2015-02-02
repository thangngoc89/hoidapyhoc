<?php namespace Quiz\Http\Requests\Exam;

use Illuminate\Contracts\Auth\Guard;
use Quiz\Http\Requests\Request;
use Quiz\lib\Repositories\Exam\ExamRepository;
use Quiz\lib\Repositories\Upload\UploadRepository;

class ExamUpdateRequest extends Request {
    /**
     * @var ExamRepository
     */
    private $exam;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @param ExamRepository $exam
     * @return \Quiz\Http\Requests\Exam\ExamUpdateRequest
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

        $rules = [
            'name' => 'required|min:6|unique:tests,id,'.$exam->id,
            'thoigian' => 'required|integer|between:5,200',
            'begin' => 'required|integer|min:1',
            'tags'   => 'required',
            'questions' => 'required|array'
        ];

        // It much have both is_file and file_id fields to be accepted
        if (!$this->request->get('is_file') || !$this->request->get('file_id'))
        {
            $rules['content'] = 'required|min:10';
            return $rules;
        }

        if ($exam->file_id != $this->request->get('file_id'))
            $rules['file_id'] = 'exists:users_upload,id';

        return $rules;

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
