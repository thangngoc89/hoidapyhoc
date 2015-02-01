<?php namespace Quiz\lib\Helpers;


class OnlineServices {

    /**
     * @return string
     */
    public static function getGravatar($email)
    {
        $s = 200;
        $d = 'monsterid'; # [ 404 | mm | identicon | monsterid | wavatar ]
        $r = 'g';
        $img = false;
        $atts = array() ;
        $url = 'http://www.gravatar.com/avatar/';
        $url .= md5( strtolower( trim( $email ) ) );
        $url .= "?s=$s&d=$d&r=$r";
        if ( $img ) {
            $url = '<img src="' . $url . '"';
            foreach ( $atts as $key => $val )
                $url .= ' ' . $key . '="' . $val . '"';
            $url .= ' />';
        }
        return $url;
    }
} 