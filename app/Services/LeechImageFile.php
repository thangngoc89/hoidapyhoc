<?php namespace Quiz\Services;

/**
 * @property bool object
 */
class LeechImageFile {

    public $img;

    public $link;

    public $object;

    /**
     * @param $link
     * @return Image Stream
     */
    public function execute($link, $object = false)
    {
        $this->object = $object;

        $this->link = $link;

        $this->setImg();

        return $this->img;

    }

    private function setImg()
    {
        $this->img = \Image::cache(function($image) {
            $image->make($this->link)->encode('jpg');
        }, 14400, $this->object);
    }

//    public function encode()
//    {
//        $imgData = base64_encode($this->img);
//        $src = 'data: '.$this->img->mime().';base64,'.$imgData;
//
//        return $src;
//    }

}