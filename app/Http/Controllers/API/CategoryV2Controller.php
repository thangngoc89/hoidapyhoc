<?php

class CategoryV2Controller extends \APIController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
    protected $category;
    public function __construct(Category $category)
    {
        parent::__construct();
        $this->category         = $category;
    }
	public function index()
	{
        try{
            $statusCode = 200;
            $builder = ApiHandler::parseMultiple($this->category, array('name'), $this->passParams('questions'));

            $categorys = $builder->getResult();
            $response = [];
            foreach($categorys as $category){
                $response[] = $this->responseMap($category);
            }

            return $this->makeResponse($response,$statusCode, $builder);
        }catch (Exception $e){
            $statusCode = 500;
            $message = $e->getMessage();
            return Response::json($message, $statusCode);
        }
	}

    public function show($id)
    {
        try{
            $statusCode = 200;
            $category = $this->category->find($id);
            $response = $this->responseMap($category);

            return Response::json($response, $statusCode);
        }catch (Exception $e){
            $statusCode = 500;
            $error = $e->getMessage();
            return Response::json($error, $statusCode);
        }
    }

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
        $rules = array(
            'name' => 'required',
            'description' => 'required|min:5',
            'color' => 'required|min:6|max:6',
            'slug'  => 'unique:categories,slug',
        );
        $validator = Validator::make(Input::all(),$rules);
        if ($validator->fails())
        {
            $statusCode = 400;
            $messages = $validator->messages();
            return Response::json($messages, $statusCode);
        } else {
            $c = $this->category;
            $c->name = Input::get('name');
            $c->description = Input::get('description');
            $c->color = Input::get('color');
            $c->slug = (empty(Input::get('slug'))) ? Slugify::slugify(Input::get('name')) : Input::get('slug');
            $c->save();

            # Flush Cache Category List
            Cache::forget('category_list'); # Call in QuizController@index
            return $this->show($c->id);
        }
	}
    public function update(){
        $rules = array(
            'name' => 'required',
            'description' => 'required|min:5',
            'color' => 'required|number|min:6|max:6',
        );
        $validator = Validator::make(Input::all(),$rules);
        if ($validator->fails())
        {
            $statusCode = 400;
            $messages = $validator->messages();
            return Response::json($messages, $statusCode);
        } else {
            $c = $this->category->find(Input::get('id'));
            $c->name = Input::get('name');
            $c->description = Input::get('description');
            $c->color = Input::get('color');
            $c->slug = (empty(Input::get('slug'))) ? Slugify::slugify(Input::get('name')) : Input::get('slug');
            $c->save();
            return $this->show($c->id);
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
        try
        {
            $c = $this->category->findOrFail($id);
            if ($c->test->count() > 0)
                throw new Exception ('This Category is not empty. CAN NOT delete');
            else
                $c->delete();

        } catch (Exception $e){
            $statusCode = 400;
            $error = $e->getMessage();
            return Response::json($error, $statusCode);
        }
	}

    private function responseMap($object)
    {
        return [
            'id'                => $object->id,
            'name'              => $object->name,
            'description'       => $object->description,
            'color'             => $object->color,
            'slug'              => $object->slug,
        ];
    }

}
