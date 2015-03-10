<?php namespace Quiz\Http\Controllers\API\Utility;

use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Quiz\Http\Requests\API\LinkParagraphShortenRequest;
use Quiz\Http\Requests\API\LinkShortenRequest;
use Quiz\lib\ExternalLink\Shorten\ShortenInterface;
use Illuminate\Http\Response;
use Quiz\lib\Helpers\Str;

class ExternalLinkController extends Controller
{
	/**
	 * Return an shortened link of given link
	 *
	 * @return Response::json();
	 */
	public function shorten(LinkShortenRequest $request, ShortenInterface $shortener)
	{
        $link = $request->link;
        $custom = $request->link;

        $shortenLink = $shortener->shorten($link);

        $data = [
            'data' => [
                'url' => $shortenLink,
                'longUrl' => $link,
            ]
        ];
        return response()->json($data,200);
	}

    /**
     * Shorten all given link inside a paragraph
     *
     * @param LinkParagraphShortenRequest $request
     * @return string
     */
    public function paragraphShorten(LinkParagraphShortenRequest $request, ShortenInterface $shortener)
    {
        #TODO: Refactor
        $paragraph = $request->paragraph;

        $links = Str::getUrls($paragraph);

        if ( ! count($links) )
        {
            $data = [
                'data' => [
                    'original_paragraph' => $paragraph,
                    'paragraph' => $paragraph
                ],
                'meta' => [
                    'message' => 'No links for shorten',
                ]
            ];

            return response()->json($data, 200);
        }

        $newParagraph = $paragraph;

        foreach(array_unique($links) as $link)
        {
            try {
                $newLink = $shortener->shorten($link);
            } catch (\Exception $e)
            {
                $newLink = $link;
            }

            $newParagraph = str_replace($link, $newLink, $newParagraph);
        }

        $data = [
            'data' => [
                'original_paragraph' => $paragraph,
                'paragraph' => $newParagraph
            ],
            'meta' => [
                'message' => 'OK',
            ]
        ];

        return response()->json($data, 200);

    }

}
