<?php namespace Quiz\Http\Controllers\API;

use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

use Quiz\Http\Requests\EditTestRequest;
use Quiz\Http\Requests\SaveNewTest;
use Quiz\lib\API\Transformers\ExamTransformers;
use Quiz\lib\Repositories\Exam\ExamRepository as Exam;
use Quiz\Models\History;
use Quiz\Models\Question;

use Quiz\Services\PullExternalImage;
use Sorskod\Larasponse\Larasponse;

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
     * @var Larasponse
     */
    private $fractal;

    /**
     * @param Exam $test
     * @param History $history
     * @param Request $request
     * @param Guard $auth
     * @param Question $question
     * @param Larasponse $fractal
     */
    public function __construct(Exam $test, History $history, Request $request, Guard $auth, Question $question, Larasponse $fractal)
    {
        $this->test         = $test;
        $this->question     = $question;
        $this->history      = $history;
        $this->request      = $request;
        $this->auth         = $auth;
        $this->fractal      = $fractal;

        $this->middleware('auth', ['except' => 'index']);
    }


	public function index()
	{
        $limit = \Input::get('limit') ?: 3;

        $test = $this->test->paginate($limit);

        return $this->fractal->paginatedCollection($test, new ExamTransformers());
    }

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store(SaveNewTest $request)
	{
        try{
            $statusCode = 200;
            $input = $request->all();

            $test = $this->test->fill($input);
            $test->user_id = $this->auth->user()->id;

            #TODO: Hardwork on this
            $test->is_approve = true;
            if ($test->save())
                $test->tag($input['tags']);

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
	public function show($test)
	{
        return $this->fractal->item($test, new ExamTransformers());
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($tests, EditTestRequest $request)
	{
        try{
            $statusCode = 200;
            $input = $request->all();

            $test = $this->test->fill($input);
            $test->user_id = $this->auth->user()->id;

            #TODO: Hardwork on this
            $test->is_approve = true;
            if ($test->save())
                $test->tag($input['tags']);

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

        return response()->json(\Input::all());
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
                    'test_id' => $id,
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
            $test = $this->test->getFirstBy('id',$id);
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
	public function destroy($test)
	{
        $test->delete();
        return 'Deleted';
	}

}
