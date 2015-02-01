<?php namespace Quiz\Services;

class LeechImageFile {

    public $img;

    public $link;

    /**
     * @param $link
     * @return Image Stream
     */
    public function execute($link)
    {
        $this->link = $link;

        $this->setImg();

        return $this->img;

    }

    private function setImg()
    {
        $this->img = \Image::cache(function($image) {
            $image->make($this->link)->encode('jpg');
        }, 14400);
    }

//    public function encode()
//    {
//        $imgData = base64_encode($this->img);
//        $src = 'data: '.$this->img->mime().';base64,'.$imgData;
//
//        return $src;
//    }

}