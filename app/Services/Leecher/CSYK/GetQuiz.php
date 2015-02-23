<?php namespace Quiz\Services\Leecher\CSYK;

use Quiz\Services\Leecher\BaseLeecher;
use Input;
use Quiz\lib\Helpers\Str;

class GetQuiz extends BaseLeecher {


    const POS_FIRST_ANS = 1;

    const POS_MIDDLE_ANS = 2;

    const POS_LAST_ANS = 3;

    private $body;

    /**
     * Simple get HTML Body of given link
     *
     * @param $link
     * @return $this
     */
    public function get($link)
    {
        $response = $this->client->get($link);

        $this->body = $response->getBody();

        return $this;
    }

    /**
     * Main function : parse information
     *
     */
    public function parse()
    {
        $html = $this->parser->str_get_html($this->body);

        $quiz = $this->parseQuiz($html);

        return $quiz;
    }

    /**
     * Parse into quiz structure
     *
     * @param $html
     */
    private function parseQuiz($html)
    {
        $name = $this->parseName($html);

        $content = $html->find('div[class=pure_content]',0);

        $questions = $this->parseQuestions($content);

//        dd($questions);
        return view('quiz.render.chiaseykhoaHint',compact('questions'));
    }

    /**
     * Parse exam's name (post's title)
     *
     * @param $html
     * @return string
     */
    private function parseName($html)
    {
        $name = $html->find('div[class=page_heading]',0)->plaintext;
        $name = html_entity_decode($name);

        return $name;
    }

    private function parseQuestions($content)
    {
        $questions = [];
        $item = [];
        $inputs = $content->find('input[onclick^="alert"]');

        foreach ($inputs as $index => $input)
        {
            $cursor = $this->cursorPosition($input);

            if ($cursor['pos'] == self::POS_FIRST_ANS)
            {
                # If this is a new questions
                # then push to questions array
                if (!empty($item))
                {
                    $questions[] = $item;
                    $item = [];
                }

                $item[] = trim($cursor['sentence']->plaintext);
                $item[] = $this->parseHintAndValueFromInut($input);
            }

            if ($cursor['pos'] == self::POS_MIDDLE_ANS)
                $item[] = $this->parseHintAndValueFromInut($input);

        }

        return $questions;
    }


    private function cursorPosition($input)
    {
        $parent = $input;

        while ($parent->tag != 'p')
        {
            $parent = $parent->parent();
        }

        $next_sib = $parent->next_sibling();
        $prev_sib = $parent->prev_sibling();

        if ( empty( $prev_sib->find('input[onclick]') ))
            return [
                'pos' => self::POS_FIRST_ANS,
                'sentence' => $prev_sib,
            ];

        if ( !is_null($next_sib->find('input[onclick]')) )
            return [
                'pos' => self::POS_MIDDLE_ANS,
            ];
    }


    /**
     * Parse Hint(Javscript Alert Value) And Value From Input Tag
     *
     * @param $input
     * @return array
     */
    private function parseHintAndValueFromInut($input)
    {
        preg_match('/&quot;(.*?)&quot;/i', $input, $hint);
        $value = "<b>{$input->value}. </b>".trim($input->parent()->parent()->plaintext);

        return [
            'value' => $value,
            'hint' => $hint[1],
        ];
    }

    private function createQuestionsArray($questions)
    {

    }


}