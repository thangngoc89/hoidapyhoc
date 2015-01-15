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
                            <a href="/login/oauth/Facebook?return={{ Request::url() }}" class="facebook">Facebook</a>
                            <a href="/login/oauth/Google?return={{ Request::url() }}" class="google">Google</a>
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

<script src="{{ asset('assets/javascript/redesign.min.js') }}"></script>
<script>
$(function() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-Token': $('meta[name="csrf"]').attr('content')
        }
    });
});
</script>
@yield('script')