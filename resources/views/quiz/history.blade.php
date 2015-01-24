@extends('layouts.main')

@section('jumbotron')
<div class="jumbotron">
    <div class="container">
        <div class="participation__avatar">
            <a href="{{ $history->user->profileLink() }}">
                <img src="{{ $history->user->getAvatar() }}" class="img-circle" title ="{{ $history->user->getName() }}" alt="{{ $history->user->getName() }}">
            </a>
        </div>
        <h2 class="jumbotron__heading">Kết quả thi của <a href="{{ $history->user->profileLink() }}"><strong>{{ $history->user->name}}</strong></a></h2>
        <h2 class="jumbotron_second-heading"><a href="{{ $t->link() }}">Đề thi {{ $t->name }}</a></h2>
        <h4 class="jumbotron__sub-heading">
            <a href="{{ $t->category->link() }}" class="btn btn-forum" style="color: #000;background-color:#{{ $t->category->color }}">
                {{ $t->category->name }}
            </a>
            <span class="text-muted label-small last-updated">
                vào <a href="{{ $t->link() }}">{{ $t->date() }}</a>
                | <a href="{{ $t->link() }}">{{ $t->question->count() }}</a> câu hỏi
                | <a href="{{ $t->link() }}">{{ $t->thoigian }}</a> phút
            </span></h4>
        <a href="/quiz/create" class="btn btn-primary">
            <i class="fa fa-plus"></i> Tạo đề thi mới
        </a>
    </div>
</div>
@stop


@section('title')
    Kết quả thi - {{ trim($t->name) }}
@stop

{{--Body Section--}}
@section('body')
<div class="container">
    <div class="row">

        @include('quiz.historyContent')

    </div>
</div>
@stop
@section('script')
<script>
$(document).ready(function(){
    $("#conversations-sidebar, .threads-inner").stick_in_parent();
    $('[data-toggle="tooltip"]').tooltip();
    $('.ansRow').popover({
        placement: 'left',
        trigger: 'manually',
        html: true,
        title: function(){
            return 'Gợi ý câu '+$(this).data('qindex');
        },
        content: function(){
            data = $(this).data('content');
            if (!data)
            {
                return 'Chưa có gợi ý';
            } else {
                return data;
            }
        }
    })
    .on('click', function () {
        $('.ansRow.curItem').removeClass('curItem');
        $(this).addClass('curItem');
        $('.ansRow:not(.curItem)').popover('hide');

        $('.ansRow.curItem').popover('toggle');
    })
    .on('show.bs.popover', function () {
        $(this).addClass('active');
    })
    .on('hide.bs.popover', function () {
        $(this).removeClass('active');
    });
});
</script>
@stop