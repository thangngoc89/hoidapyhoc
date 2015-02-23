<?php namespace Quiz\Services\Leecher\CSYK;

use Quiz\Services\Leecher\BaseLeecher;
use Input;
use Quiz\lib\Helpers\Str;

class GetQuiz extends BaseLeecher {

    private $body;

    public function get($link)
    {
        $response = $this->client->get($link);

        $this->body = $response->getBody();

        return $this;
    }

    public function parse()
    {
        $html = $this->parser->str_get_html($this->body);

        $quiz = $this->parseQuiz($html);

        return $quiz;
    }

    private function parseQuiz($html)
    {
        $name = $this->parseName($html);

        $content = $html->find('div[class=pure_content]',0);

        $questions = $this->breakIntoQuestions($content);
    }

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
        foreach ($content->find('p') as $row)
        {
            if (trim($row->plaintext) == '&nbsp;' || $row->outertext == '<hr>')
            {
                $questions[] = $item;
                $item = [];
            } else {
                $item[] = $row;
            }
        }

        $questions = array_filter($questions);

        return $this->previewQuestionsArray($questions);
    }

    private function previewQuestionsArray($questions)
    {
        foreach ($questions as $q)
        {
            foreach ($q as $row)
            {
                echo $row->plaintext."<br>";
            }

            echo '<hr>';
        }
    }
    private function serializeAnswerRow($html)
    {

    }

} 