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
     * @return \Image Stream
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
        $this->img = \Image::make($this->link)->encode('jpg');
    }

}