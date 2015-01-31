<?php

namespace spec\Quiz\lib\Helpers;

use Illuminate\Support\Collection;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

class StrSpec extends ObjectBehavior
{
    function it_is_initializable()
    {
        $this->shouldHaveType('Quiz\lib\Helpers\Str');
    }

    function it_should_return_a_parse_of_base64_image_string()
    {
        $string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAssAAACzC';
        $object = [
            'extension' => 'png',
            'mimetype'  => 'image/png',
            'data'      => 'iVBORw0KGgoAAAANSUhEUgAAAssAAACzC'
        ];
        $this->base64ImageParser($string)->shouldReturn($object);
    }
}
