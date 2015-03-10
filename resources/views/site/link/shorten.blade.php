@extends('layouts.main')

@section('title')
Rút gọn link
@endsection

@section('meta_description')
Rút gọn link, tạo link cực ngắn với tên miền yhoc.co :: Power by HoiDapYHoc.com
@endsection

@section('header')
<style>
.shorten-url {
    font-size: 30px;
    margin-top: 30px;
    padding: 30px;
    border: #808080 dashed 3px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
}

@media (max-width: 767px) {
  #btn-shorten span {
    display: none;
  }
}
</style>
@endsection

@section('body')
<div id="signup-banner" class="banner hide-from-mobile">
    <div class="container">
        <h2 class="signup-welcome">
            Rút gọn link
        </h2>
    </div>
</div>

<main>
    <div class="container">
        <div class="row" id="signup-form">
        {!! Form::open(['class' => 'col-md-8 col-md-offset-2', 'route' => 'api.v2.ultility.link.shorten', 'id' => 'form-url']) !!}
        <div class="panel panel-default registration">
            <div class="panel-body">
                <fieldset>
                    <div class="form-group row">
                        <div class="input-group col-md-8 col-md-offset-2">
                              <input type="url" class="form-control" id="input-url" placeholder="Nhập link cần rút gọn" name="link" required>
                              <span class="input-group-btn">
                                <button class="btn btn-primary" type="submit" id="btn-shorten" data-loading="Đang xử lí">
                                    <i class="fa fa-arrow-right"></i> <span>Rút gọn</span></button>
                              </span>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="input-group col-md-8 col-md-offset-2">
                            <input type="url" class="form-control shorten-url" id="input-shorten-url" placeholder="Link đã rút gọn" data-title="Ctrl+C" data-toggle="tooltip">
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
       {!! Form::close() !!}
        </div>
    </div>
</main>
@endsection

@section('script')
<script>
$(function() {

    $submitButton =$('#btn-shorten');
    $inputShortenUrl = $("#input-shorten-url");
    $inputUrl = $('#input-url');

    $('#form-url').on('submit', function($e)
    {
        $e.preventDefault();

        url = $(this).attr('action');
        $.ajax({
            type: 'POST',
            dataType: "json",
            url: url,
            data: {'link' : $inputUrl.val() },
            beforeSend: function(){
                $submitButton.button('loading');
            },
            error: function (data) {
                $submitButton.button('reset');
                toastr.error('Có lỗi xảy ra. Vui lòng thử lại');
            },
            success: function (data) {
                $submitButton.button('reset');
                $inputShortenUrl
                    .val(data.url)
                    .tooltip('show')
                    .select();
            }
        });
    });

    $("input[type='url']").on('focus', function($e)
    {
        $(this).select();
    });
});
</script>
@endsection