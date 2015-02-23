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

        $questions = $this->breakIntoQuestions($content);
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

    private function breakIntoQuestions($content)
    {
        $questions = [];
        $item = [];
        $inputs = $content->find('input[onclick^="alert"]');

        $input = $inputs[0];

        foreach ($inputs as $input)
        {
            $cursor = $this->cursorPosition($input);
            if ($cursor == self::POS_FIRST_ANS)
            {
                $item[] = $this->getQuestionSentence($input);
                $item[] = $this->parseHintAndValueFromInut($input->outertext);
            }

            if ($cursor == self::POS_MIDDLE_ANS)
                $item[] = $this->parseHintAndValueFromInut($input->outertext);
        }

//        $questions = array_filter($questions);

    }


    private function cursorPosition($input)
    {
        $parent = $input->parent()->parent();

        $next_sib = $parent->next_sibling();
        $prev_sib = $parent->prev_sibling();

        if (is_null($prev_sib->find('input[onclick]')))
            return self::POS_FIRST_ANS;

        if (!is_null($next_sib)->find('input[onclick]'))
            return self::POS_MIDDLE_ANS;
    }

    private function getQuestionSentence($input)
    {
        $sentence = $input->parent()->parent()->prev_sibling()->plaintext;
        return trim($sentence);
    }


    private function parseHintAndValueFromInut($input)
    {
        preg_match('/&quot;(.*?)&quot;/i', $input, $hint);
        preg_match('/value=\"(.*?)\"/i', $input, $value);

        return [
            'value' => $value[1],
            'hint' => $hint[1],
        ];
    }



} 