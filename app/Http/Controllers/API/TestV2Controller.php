<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use Quiz\Http\Requests\SaveNewTest;
use Quiz\lib\Repositories\Exam\ExamRepository as Exam;
use Quiz\Models\History;
use Illuminate\Http\Response;
use Quiz\Models\Question;
use Quiz\Services\PullExternalImage;

class TestV2Controller extends APIController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
    protected $test;

    protected $history;
    /**
     * @var Request
     */
    private $request;
    /**
     * @var Guard
     */
    private $auth;
    /**
     * @var Question
     */
    private $question;

    /**
     * @param Exam $test
     * @param History $history
     * @param Request $request
     * @param Guard $auth
     * @param Question $question
     */
    public function __construct(Exam $test, History $history, Request $request, Guard $auth, Question $question)
    {
        $this->test         = $test;
        $this->question     = $question;
        $this->history      = $history;
        $this->request      = $request;
        $this->auth         = $auth;
        $this->middleware('auth', ['except' => 'index']);
    }


	public function index()
	{

        try{
            $statusCode = 200;
            $tests = $this->test->paginate(10);

            $response = [];
            foreach($tests as $test){
                $response[] = $this->responseMap($test);
            }
//            return response()->json($response, $statusCode)->header('X-Total-Count', $builder->getHeaders()['Meta-Filter-Count']);
            return response()->json($response, $statusCode);

        }catch (\Exception $e){
            $statusCode = 500;
            $message = $e->getMessage();
            return response()->json($message, $statusCode);
        }
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
        try{
            return response()->json(\Input::all(), 200);

            $statusCode = 200;
            $input = $request->all();

            $test = $this->test->fill($input);
            $test->user_id = $this->auth->user()->id;

            #TODO: Hardwork on this
            $test->is_approve = true;
            $test->save();

            $this->storeQuestion($test,$input);

            $response = [
                'id'        => $test->id,
                'url'       => $test->link(),
                'editUrl'   => $test->link('edit'),
            ];
            return response()->json($response, $statusCode);
        }catch (\Exception $e){
            $statusCode = 500;
            return response()->json($e->getMessage(), $statusCode);
        }
    }

    public function storeQuestion($test, $input)
    {
        foreach ($input['questions'] as $q)
        {
            $question = new $this->question($q);
            $question->test_id = $test->id;
            $question->save();
        }
    }


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
        try{
            $statusCode = 200;
            $test = $this->test->findOrFail($id);

            return response()->json($test, $statusCode);
        }catch (\Exception $e){
            $statusCode = 500;
            return response()->json($e->getMessage(), $statusCode);
        }
	}


	/**
	 * Update the specified resource in storage.
	 *
     * @method PUT
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
        return response()->json(\Input::all());
	}

    /**
     * Upload image endpoint
     */
    public function upload()
    {
        $file = \Input::file('file');
        $input = array('image' => $file);
        $rules = array(
            'image' => 'image'
        );
        $validator = \Validator::make($input, $rules);
        if ( $validator->fails()) {
            return Response::json(array('success' => false, 'errors' => $validator->getMessageBag()->toArray()));
        }

        $fileName = time() . '-' . $file->getClientOriginalName();
        $destination = public_path() . '/uploads/';
        $file->move($destination, $fileName);

        echo url('/uploads/'. $fileName);
    }

    public function pullPicture($id, PullExternalImage $puller)
    {
        $test = $this->test->find($id);
        return $puller->excute($test->content);
    }
    /**
     * Create a new history for test
     * @param $id
     * @return mixed
     */
    public function start($id)
    {
        try{
            $statusCode = 200;

            $history = $this->history->firstOrCreate(
                array(
                    'user_id' => $this->auth->user()->id,
                    'test_id' => \Input::get('test_id'),
                    'isDone'  => 0
                ));

            $response= [
                'user_history_id' => $history->id
            ];

            return response()->json($response, $statusCode);
        }catch (\Exception $e){
            $statusCode = 500;
            $error = $e->getMessage();
            return response()->json($error, $statusCode);
        }
    }
    /**
     * Check post and return right answer
     * @param $id
     */
    public function check ($id)
    {
        try{
            $statusCode = 200;

            $user = $this->auth->user();
            $test = $this->test->getFirstBy('id',$id,['question']);
            $history = $this->history->findOrFail(\Input::get('user_history_id'));

            if ($history->user_id != $user->id) throw new \Exception ('Don\'t cheat man');

            $input = $this->request->answers;
            $score = 0;
            $answerString = '';

            foreach ($test->question as $index => $q)
            {
                $answer = $this->numberToChar($input[$index]);
                $answerString .= $answer;
                if ($q->right_answer == $answer)
                {
                    $score++;
                }
            }

            $history->score = $score;
            $history->answer = $answerString;
            $history->is_first = ( $this->history->firsttime($user->id, $id) ) ? true : false;
            $history->isDone = true;
            $history->save();

            $response= [
                'score' => $score,
                'totalQuestion' => $test->question->count(),
                'url'   => '/quiz/ket-qua/'.$test->slug.'/'.$history->id,
            ];
//            dd($score);
            return response()->json($response, $statusCode);
        }catch (\Exception $e){
            $statusCode = 500;
            $error = $e->getMessage();
            return response()->json($error, $statusCode);
        }
    }
    public function numberToChar($num){
        switch ($num){
            case 0: return '_'; break;
            case 1: return 'A'; break;
            case 2: return 'B'; break;
            case 3: return 'C'; break;
            case 4: return 'D'; break;
            case 5: return 'E'; break;
        }
    }

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
        $test = $this->test->findOrFail($id);
        $test->delete();
        return 'Deleted';
	}

    private function responseMap($object)
    {
        return [
            'id'            => $object->id,
            'category_id'   => $object->cid,
            'user_id'       => $object->user_id,
            'name'          => $object->name,
            'slug'          => $object->slug,
            'questions'     => $object->question->count(),
            'content'       => $object->content,
            'is_file'       => $object->is_file,
            'is_approve'    => $object->is_approve,
            'count'         => $object->count,
            'thoigian'      => $object->thoigian,
            'description'   => $object->description,
        ];
    }
}
