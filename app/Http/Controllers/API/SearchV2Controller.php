<?php namespace Quiz\Http\Controllers\API;

use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;

class SearchV2Controller extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$result = [
            [
                'text' => 'tag',
                'children' => [
                    ['id' => '1', 'text' => 'tag1'],
                    ['id' => '2', 'text' => 'tag2']
                ]
            ],
            [
                'text' => 'exam',
                'children' => [
                    ['id' => '1', 'text' => 'exam1'],
                    ['id' => '2', 'text' => 'exam2']
                ]
            ]
        ];

//        $result = [['id' => '1', 'text' => 'exam1'],['id' => '2', 'text' => 'exam2']];

        $response = ['results' => $result];

        return response()->json($response);
	}


}
