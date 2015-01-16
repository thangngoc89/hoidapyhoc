{{-- Web site Title --}}
@section('title')
Đăng nhập
@parent

@stop

<!DOCTYPE html>
<html lang="vi">
    @include('partials.header')
    <body class="form-only">
        <div id="form" class="login">
            <h1 class="logo">Hỏi Đáp Y Học</h1>
            <div class="panel panel-default">
                <div class="panel-body">
                    <div class="form-group">
                        <a href="/auth/external/facebook" class="btn btn-block btn-lg" style="background: #3B5998; color: #fff">
                            Đăng nhập với Facebook
                        </a>
                    </div>
                    <div class="form-group">
                        <a href="/auth/external/google" class="btn btn-block btn-lg" style="background: #C23321; color: #fff">
                            Đăng nhập với Google
                        </a>
                    </div>
                </div>
            </div>
            <div class="panel-footer">
                Copyright @ <a href="/">Hỏi Đáp Y Học 2015</a>
            </div>
        </div>
    </body>
</html>