<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
//use Quiz\Models\User;
use Quiz\Models\Exam;
use Quiz\Models\History;
use Illuminate\Http\Response;
use Illuminate\Contracts\Routing\ResponseFactory;

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
     * @param Exam $test
     * @param History $history
     * @param Request $request
     * @param Guard $auth
     */
    public function __construct(Exam $test, History $history, Request $request, Guard $auth)
    {

        $this->test         = $test;
        $this->history      = $history;
        $this->request = $request;
        $this->auth = $auth;
    }
	public function index()
	{

        try{
            $statusCode = 200;
//            $builder = ApiHandler::parseMultiple($this->test->with('question'), array('name'), $this->passParams('tests'));
//            $tests = $builder->getResult();
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
		//
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
            $test = $this->test->find($id);

            $response = $this->responseMap($test);

            return response()->json($response, $statusCode);
        }catch (Exception $e){
            $statusCode = 500;
            return response()->json($e->getMessage(), $statusCode);
        }
	}


	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		dd(\Input::all());
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
     * Check post and return right answer
     * @param $id
     */
    public function check ($id)
    {
        try{
            $statusCode = 200;

            $user = $this->auth->user();
            $test = $this->test->with('question')->findOrFail($id);
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
                'url'   => \URL::to('quiz/t').'/'.$test->slug.'/ket-qua/'.$history->id,
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
