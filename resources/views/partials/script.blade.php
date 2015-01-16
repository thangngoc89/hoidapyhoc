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

<script src="{{ elixir('js/all.js') }}"></script>
<script src="{{ elixir('js/script.js') }}"></script>
<script>
@foreach (['success','error','warning','info'] as $notice)
    @if ($message = Session::get($notice))
        @if(is_array($message))
            @foreach ($message as $m)

                toastr['{{ $notice }}'](' {{ $m }} ');
            @endforeach
        @else
            toastr['{{ $notice }}'](' {{ $message }} ');
        @endif
    @endif
@endforeach
</script>

@yield('script')