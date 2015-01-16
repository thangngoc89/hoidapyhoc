<?php

class QuestionV2Controller extends \APIController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
    protected $question;
    public function __construct(Question $question)
    {
        parent::__construct();
        $this->question         = $question;
    }
	public function index()
	{
        try{
            $statusCode = 200;
            $builder = ApiHandler::parseMultiple($this->question, array('name'), $this->passParams('questions'));

            $questions = $builder->getResult();
            $response = [];
            foreach($questions as $question){
                $response[] = $this->responseMap($question);
            }

            return $this->makeResponse($response,$statusCode, $builder);
        }catch (Exception $e){
            $statusCode = 500;
            $message = $e->getMessage();
            return Response::json($message, $statusCode);
        }
	}

    private function responseMap($object)
    {
        return [
            'id'            => $object->id,
            'test_id'       => $object->test_id,
            'content'       => $object->cid,
            'right_answer'  => $object->right_answer,
        ];
    }

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{

	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}


}
