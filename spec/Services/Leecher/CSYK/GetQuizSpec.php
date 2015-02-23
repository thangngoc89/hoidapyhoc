<?php

namespace spec\Quiz\Services\Leecher\CSYK;

use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

use GuzzleHttp\Client;
use Illuminate\Cache\Repository as Cache;
use Sunra\PhpSimple\HtmlDomParser;

class GetQuizSpec extends ObjectBehavior
{
    function let(Client $client, HtmlDomParser $parser)
    {
        $this->beConstructedWith($client, $parser);
    }

    function it_is_initializable()
    {
        $this->shouldHaveType('Quiz\Services\Leecher\CSYK\GetQuiz');
    }

    function it_should_return_value_and_hint_from_input_outertext()
    {
        $input = '<input onclick=\"alert(&quot;SAI! Biểu mô lát đơn không có ở khí quản, có thể gặp ở màng bụng, màng phổi v.v...&quot;)\" type="button" value="A" />';

        $ret = [
            'value' => 'A',
            'hint' => 'SAI! Biểu mô lát đơn không có ở khí quản, có thể gặp ở màng bụng, màng phổi v.v...',
        ];

        $parse = $this->parseHintAndValueFromInut($input)->shouldReturn($ret);

    }
}
