<?php namespace Quiz\Http\Requests\API;

use Quiz\Http\Requests\Request;
use Illuminate\Auth\Guard;
use Quiz\lib\Repositories\Video\VideoRepository as Video;

class VideoUpdateRequest extends Request {
    /**
     * @var Video
     */
    private $video;

    /**
     * @param Video $video
     */
    public function __construct(Video $video)
    {
        $this->video = $video;
    }
	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize(Guard $auth)
	{
        if (!$auth->check())
            return false;
        if (!$auth->user()->can('manage_videos'))
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
        $table = $this->video->getTable();
        $video = $this->getVideo();

		return [
			'title' => "required|min:6|unique:{$table},id,{$video->id}",
            'link'  => "required|url",
            'thumb' => "required|url",
            'source' => "required|url",
            'description' => "required|min:6",
            'duration' => "integer|min:0",
		];
	}

    /**
     * @return mixed
     */
    private function getVideo()
    {
        $videoId = $this->segment(4);
        $video = $this->video->find($videoId);
        return $video;
    }

}
