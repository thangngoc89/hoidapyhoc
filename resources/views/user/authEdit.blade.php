@extends('layouts.main')

@section('title')
    Thông tin thành viên
@endsection

@section('body')
<div id="signup-banner" class="banner hide-from-mobile">
    <div class="container">
        <h2 class="wow fadeInDown signup-welcome">
            Hoàn thành thông tin cá nhân!
        </h2>
    </div>
</div>

<main>
    <div class="container">
        <div class="row" id="signup-form">

        {!! Form::open([
                'class' => 'col-md-8 col-md-offset-2',
                'data-remote-validate' => '/api/v2/users'
            ])
        !!}

        <div class="panel panel-default registration">
            <div class="panel-body">
                <fieldset>
                    <h3 class="signup-subheading">Thông tin:</h3>

                    <!-- Text input-->
                    <div class="form-group row">
                        {!! Form::label('username', 'Tên thành viên',[
                                'class' => 'col-md-4 control-label',
                            ])
                        !!}
                        <div class="col-md-8">
                        {!! Form::text('username', $user->username, [
                                'class' => 'form-control input-md',
                                'required',
                                'pattern' => '^[A-Za-z0-9]{3,20}$',
                                'title' => 'Tên thành viên từ 3-20 kí tự, chỉ gồm chữ cái và số',
                                'data-remote-validate',
                            ])
                        !!}
                        <div class="help-block" style="display:none">Tên thành viên này đã có người sử dụng.</div>
                        </div>
                    </div>

                    <div class="form-group row">
                        {!! Form::label('name','Tên của bạn',['class' => 'col-md-4 control-label'] ) !!}
                        <div class="col-md-8">
                        {!! Form::text('name',$user->name, [
                                'class' => 'form-control input-md',
                                'required',
                                'pattern' => '.{6,}',
                                'title' => 'Hãy nhập họ tên đầy đủ bạn nhé'
                            ])
                        !!}
                        </div>
                    </div>

                    <!-- Text input-->
                    <div class="form-group row">
                        {!! Form::label('email','Email',['class' => 'col-md-4 control-label'] ) !!}
                        <div class="col-md-8">
                        @if ( ! $user->email )
                            {!! Form::email('email',$user->email, [
                                    'class' => 'form-control input-md',
                                    'required',
                                    'data-remote-validate',
                                    'title' => 'Bạn chưa nhập email',
                                ])
                            !!}
                        @else
                            {!! Form::email('email', $user->email, [
                                    'class' => 'form-control input-md',
                                    'disabled' => 'disabled'
                                ])
                            !!}
                        @endif
                        <div class="help-block" style="display:none">Email này đã có người sử dụng.</div>
                        </div>
                    </div>
                </fieldset>
            </div>

            <div class="panel-footer clearfix">
                <div class="pull-right sign-up-buttons">
                    {!! Form::submit('Lưu',['class' => 'btn btn-primary']) !!}
                </div>
            </div>
        </div>
        {!! Form::close() !!}
        </div>
        <!-- /.row #signup-form -->
    </div>
</main>
@endsection

@section('script')
<script>new WOW().init();</script>
<script>
$(function() {

    $("input[data-remote-validate]").focusout(function(e){
        input = $(this);
        validate(input);
    });

    var validate = function(input) {
        form = input.closest('form');
        url = form.data('remote-validate');
        column = input.data('remote-validate-column') || input.prop('name');
        value = input.val();

        var data = {};
        data[column] = value;

        $.ajax({
            type: 'GET',
            dataType: "json",
            url: url,
            data: data,
            success: function (response) {
                processValidate(input, response);
            }
        });
    };

    var processValidate = function(input, response) {
        data = response.data;

        if (data.length > 0) {
            return showValidateError(input);
        } else {
            return showValidateSuccess(input);
        }
    };

    var showValidateSuccess = function(input) {
        div = input.closest('div.form-group');
        btnSubmit = input.closest('form').find("input[type='submit']");
        helpBlock = div.find('.help-block');

        div.alterClass('has-*', 'has-success');
        helpBlock.fadeOut(200);
        btnSubmit.removeProp('disabled');
    };

    var showValidateError = function(input) {
        div = input.closest('div.form-group');
        btnSubmit = input.closest('form').find("input[type='submit']");
        helpBlock = div.find('.help-block');

        div.alterClass('has-*', 'has-error');
        helpBlock.fadeIn(200);
        btnSubmit.prop('disabled','disabled');
    };
});


</script>
@endsection