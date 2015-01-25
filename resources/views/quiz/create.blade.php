@extends('layouts.main')


@section('jumbotron')
<div class="jumbotron">
    <div class="container">
        <h2 class="jumbotron__heading">Tạo đề thi mới</h2>
        <h4 class="jumbotron__sub-heading">Đường đến với tri thức</h4>
    </div>
</div>
@endsection


@section('title')
    Tạo đề thi mới
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

@section('script')
<script>
var editorName = new MediumEditor('#name', {
    buttons: ['bold', 'italic'],
    disableReturn: true,
    placeholder: 'Nhập tiêu đề của đề thi'
});
var editorDescription = new MediumEditor('#description', {
    disableReturn: true,
    placeholder: 'Mô tả ngắn cho đề thi'
});
var editorContent = new MediumEditor('#content', {
    cleanPastedHTML: true,
    placeholder: 'Nội dung đề thi (dành cho đề tự soạn và hình ảnh)',
});
$(function () {
    $('#content').mediumInsert({
        editor: editorContent,
        addons: {
          images: {
            imagesUploadScript: '/api/v2/files',
            imagesDeleteScript: '/api/v2/files'
          }
        }
      });
});
$(document).ready(function(){
    quizCreateInt();
});
</script>
@stop

@section('style')
<link href="/assets/vendor/medium-editor/css/medium-editor.css" rel="stylesheet">
<link href="/assets/vendor/medium-editor/css/themes/bootstrap.min.css" rel="stylesheet">
<link href="/assets/vendor/medium-editor/css/medium-editor-insert-plugin.min.css" rel="stylesheet">
@stop

