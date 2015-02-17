<?php namespace Quiz\Services;

/**
 * @property bool object
 */
class LeechImageFile {

    public $img;

    public $link;

    /**
     * @param $link
     * @return \Image Stream
     */
    public function execute($link)
    {
        $this->link = $link;

        $this->setImg();

        return $this->img;

    }

    private function setImg()
    {
        $this->img = \Image::make($this->link)
                    ->resize(50 , null, function ($constraint) {
                        $constraint->aspectRatio();
                    })
                    ->encode('jpg',80);
    }

}