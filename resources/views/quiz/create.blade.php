@extends('layouts.main')

@section('jumbotron')
<div class="jumbotron">
    <div class="container">
        <h2 class="jumbotron__heading">{{ $name }}</h2>
        <h4 class="jumbotron__sub-heading">Cùng nhau xây dựng kho đề thi Y học</h4>
    </div>
</div>
@endsection


@section('title')
    {{ $name }}
@stop

{{--Body Section--}}
@section('body')
<div class="container">
    @if ( Route::currentRouteName() == 'quiz.create')
        {!! Breadcrumbs::render('quiz.create') !!}
    @else
        {!! Breadcrumbs::render('quiz.edit', (object) $data['test'] ) !!}
    @endif
    {!! Form::open(['url' => 'api/v2/tests', 'id' => 'frmTest', 'data-toggle' => 'validator' ]) !!}
    <div class="row" id="mainRow">
        @include('quiz.createContent')
    </div>
    {!! Form::close() !!}
</div>

<div class="modal fade" id="answerModal" tabindex="-1" role="dialog" aria-labelledby="answerModalLabel" aria-hidden="true">
    <div class="modal-dialog" style="z-index: 10000;">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Gợi ý trả lời câu 1</h4>
            </div>
            <div class="modal-body loginFormContainer">
                <textarea id="answerModalArea"></textarea>
            </div>
            <div class="modal-footer" style="">
                <a href="/" class="bird-btn" data-dismiss="modal" aria-label="Close">Lưu</a>
            </div>
         </div>
    </div>
</div>
@stop

@section('script')

@include('components._loadCSS',['link' => elixir('css/editor.css')])
<script src="/assets/js/editor.js"></script>
<script>
    global.data = {!! json_encode($data) !!};
    $(document).ready(function(){
        $(window).quiz();
    });
</script>
@stop

