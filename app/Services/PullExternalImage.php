<?php namespace Quiz\Services;

use Sunra\PhpSimple\HtmlDomParser;

class PullExternalImage {
    /**
     * @var HtmlDomParser
     */
    private $parser;

    /**
     * @param HtmlDomParser $parser
     */
    public function __construct (HtmlDomParser $parser)
    {
        $this->parser = $parser;
    }

    public function excute($content)
    {
        $content = "<html><body>$content</body></html>";
        $html = $this->parser->str_get_html($content);

        if (!empty($html))
        {
            foreach($html->find('img') as $element)
            {
                try{
                    $link = $element->src;
                    $download = file_get_contents($link);

                    $filename = time().'.jpg';
                    if ($upload = $this->save($download, $filename))
                    {
                        $element->src = '/uploads/'.$filename;
                    }
                } catch(\Exception $e) {
                    dd($e);
                }

            }
        }
        $html->save();
        echo $html;
//        return false;
    }

    public function save($fileContent, $filename)
    {
        if (\File::put('uploads/' . $filename, $fileContent)) {
            return true;
        } else {
            return false;
        }
    }
}
