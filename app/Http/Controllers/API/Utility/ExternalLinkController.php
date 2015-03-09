<?php namespace Quiz\Http\Controllers\API\Utility;

use Quiz\Http\Requests;
use Quiz\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Quiz\Http\Requests\API\LinkShortenRequest;
use Quiz\lib\ExternalLink\Shorten\ShortenInterface;

class ExternalLinkController extends Controller
{
	/**
	 * Return an shortened link of given link
	 *
	 * @return string
	 */
	public function shorten(LinkShortenRequest $request, ShortenInterface $shortener)
	{
        $link = $request->link;
        $custom = $request->link;

        $shortenLink = $shortener->shorten($link);

        $data = [
            'url' => $shortenLink,
            'longUrl' => $link,
        ];
        return response()->json($data,200);
	}

}
