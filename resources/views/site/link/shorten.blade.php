@extends('......layouts.main')

@section('title')
    Thông tin thành viên
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

        {!! Form::open(['class' => 'col-md-8 col-md-offset-2', 'route' => 'api.v2.ultility.link.shorten']) !!}
        <div class="panel panel-default registration">
            <div class="panel-body">
                <fieldset>
                    <div class="form-group row">
                        <div class="input-group col-md-8 col-md-offset-2">
                              <input type="url" class="form-control" placeholder="Nhập link cần rút gọn" required>
                              <span class="input-group-btn">
                                <button class="btn btn-primary" type="button">Rút gọn</button>
                              </span>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="input-group col-md-8 col-md-offset-2">
                            <input type="url" class="form-control shorten-url" placeholder="Link đã rút gọn">
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
<script>new WOW().init();</script>
@endsection