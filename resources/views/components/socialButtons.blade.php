{{--<div id="social-buttons" class="rows">--}}
    {{--<div class="col-sm-3">--}}
            {{--<div class="g-plusone" data-size="medium" data-width="120"></div>--}}
    {{--</div>--}}
    {{--<div class="col-sm-9">--}}
        {{--<div class="fb-like" data-href="{{ \Request::url() }}" data-layout="button_count" data-action="like" data-show-faces="false" data-share="true"></div>--}}
    {{--</div>--}}
{{--</div>--}}

<div id="social-buttons" class="rows">
    <ul class="socialcount" data-url="{!! \Request::url() !!}">

    <li class="facebook"><a href="https://www.facebook.com/sharer/sharer.php?u={!! \Request::url() !!}" title="Share on Facebook"><span class="social-icon icon-facebook"></span><span class="count">Like</span></a></li>

    <li class="googleplus"><a href="https://plus.google.com/share?url={!! \Request::url() !!}" title="Share on Google Plus"><span class="social-icon icon-googleplus"></span><span class="count">+1</span></a></li>

    <li class="twitter"><a href="https://twitter.com/intent/tweet?text={!! \Request::url() !!}" title="Share on Twitter"><span class="social-icon icon-twitter"></span><span class="count">Tweet</span></a></li>
    </ul>
</div>