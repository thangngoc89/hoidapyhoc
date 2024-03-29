@if (\Auth::guest())
<div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="z-index: 10000;">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Đăng nhập</h4>
            </div>
            <div class="modal-body loginFormContainer">
                <div class="socialLogins">
                    <div class="socialAnchors">
                        <div>
                            <a href="/auth/external/facebook?return={{ \Request::url() }}" class="facebook">Facebook</a>
                            <a href="/auth/external/google?return={{ \Request::url() }}" class="google">Google</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="">
                <a href="/" class="bird-btn">Quay về trang chủ</a>
            </div>
         </div>
    </div>
</div>
@endif

<!-- Main file -->
<script src="{{ elixir('assets/js/vendor.js') }}"></script>
<script src="{{ elixir('assets/js/script.js') }}"></script>
<script>new WOW().init();</script>
<script>var global = {};</script>

<!-- Error messages -->
<script>
@foreach (['success','error','warning','info'] as $notice)
    @if ($message = \Session::get($notice))
        @if(is_array($message))
            @foreach ($message as $m)
                toastr['{{ $notice }}'](' {{ $m }} ');
            @endforeach
        @else
            toastr['{{ $notice }}'](' {{ $message }} ');
        @endif
    @endif
@endforeach

@if ($message = $errors->all())
    @foreach ($message as $m)
        toastr['{{ 'error' }}'](' {{ $m }} ');
    @endforeach
@endif
</script>
<div id="fb-root"></div>
<script>
function loadAPI() {
    var js = document.createElement('script');
    js.src = '//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=YOUR_APP_ID&version=v2.0';
    document.body.appendChild(js);
}

window.onscroll = function () {
    var rect = document.getElementById('comments').getBoundingClientRect();
    if (rect.top < window.innerHeight) {
        loadAPI();
        window.onscroll = null;
    }
}
</script>

<!-- GA -->
<script type="text/javascript">
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','__gaTracker');

    __gaTracker('create', '{!! config('quiz.service.googleAnalytics') !!}', 'auto');
    __gaTracker('set', 'forceSSL', true);
    __gaTracker('require', 'displayfeatures');
    __gaTracker('send','pageview');

</script>
@yield('script')
