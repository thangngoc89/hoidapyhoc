<?php

namespace spec\Quiz\lib\Repositories\Exam;

use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

class QuestionValidatorSpec extends ObjectBehavior
{
    function it_is_initializable()
    {
        $this->shouldHaveType('Quiz\lib\Repositories\Exam\QuestionValidator');
    }

    function it_should_return_true()
    {
        $data = [
            [
                'answer' => 'A',
                'content' => 'Nội dung trả lời',
            ],

            [
                'answer' => 'B',
                'content' => 'Nội dung trả lời',
            ]
        ];

        $this->validateQuestion('questions',$data,'')->shouldReturn(true);
    }
}
