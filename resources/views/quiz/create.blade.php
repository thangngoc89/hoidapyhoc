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
    <div class="row" id="mainRow">
    @include('quiz.createContent')
    </div>
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

@section('style')
<link href="/css/editor.css" rel="stylesheet">
@endsection

@section('script')
<script src="/assets/js/editor.js"></script>
<script>

Dropzone.options.dropzone = {

    url: '/api/v2/files',
    paramName: "file",
    headers: {'X-XSRF-Token': $('meta[name="csrf"]').attr('content')},
    maxFilesize: 10, // MB
    acceptedFiles: 'image/*,application/pdf',
    dictDefaultMessage: 'Kéo và thả file vào đây để upload',
    dictInvalidFileType: 'Định dạng file không cho phép',
    init: function() {
        this.on("addedfile", function(file) { console.log("Added file."); });
    }
};

global.data = {!! $data !!};
$(document).ready(function(){
    $(window).quiz();
});
</script>
@stop

