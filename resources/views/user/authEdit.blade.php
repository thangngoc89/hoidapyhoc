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


        {!! Form::open(['class' => 'col-md-8 col-md-offset-2']) !!}

        <div class="panel panel-default registration">
            <div class="panel-body">

                <fieldset>
                    <h3 class="signup-subheading">Thông tin:</h3>

                    <!-- Text input-->
                    <div class="form-group row">
                        {!! Form::label('username','Tên thành viên',['class' => 'col-md-4 control-label'] ) !!}
                        <div class="col-md-8">
                        {!! Form::text('username',$user->username, ['class' => 'form-control input-md',
                                                        'required','pattern' => '^[A-Za-z0-9_]{3,20}$',
                                                        'title' => 'Tên thành viên từ 3-20 kí tự, chỉ gồm kí tự, số và dấu _'
                                                        ]) !!}

                        </div>
                    </div>

                    <div class="form-group row">
                        {!! Form::label('name','Tên của bạn',['class' => 'col-md-4 control-label'] ) !!}
                        <div class="col-md-8">
                        {!! Form::text('name',$user->name, ['class' => 'form-control input-md',
                                                           'required','pattern' => '.{6,}',
                                                           'title' => 'Tên tối thiểu 6 kí tự'
                                                           ]) !!}
                        </div>
                    </div>

                    <!-- Text input-->
                    <div class="form-group row">
                        {!! Form::label('email','Email',['class' => 'col-md-4 control-label'] ) !!}
                        <div class="col-md-8">
                        {!! Form::text('email',$user->email, ['class' => 'form-control input-md', 'disabled' => 'disabled']) !!}
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
    </div>
</main>
@endsection

@section('script')
<script>new WOW().init();</script>
@endsection