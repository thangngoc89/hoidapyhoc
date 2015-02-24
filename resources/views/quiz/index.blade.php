@extends('layouts.main')

@section('jumbotron')

<div class="jumbotron">
    <div class="container">
        <h2 class="jumbotron__heading">{{ $name }}</h2>
        <h4 class="jumbotron__sub-heading">Kho Đề trắc nghiệm..</h4>

        <a href="/quiz/create" class="btn btn-primary">
            <i class="fa fa-plus"></i> Tạo đề thi mới
        </a>
    </div>
</div>
@stop


@section('title')
    {{ $name }}
@stop

@section('meta_description')
Tổng hợp đề thi Y Khoa. Làm đề thi trắc nghiệm trực tuyến
@endsection

@section('body')
<div class="container">
    <div class="row">
        <div class="threads-inner white col-md-8">
            @include('quiz.indexContent')
        </div>
        <div id="conversations-sidebar" class="white col-md-4">
            @include('quiz.indexSidebar')
        </div>
    </div>
</div>
@stop