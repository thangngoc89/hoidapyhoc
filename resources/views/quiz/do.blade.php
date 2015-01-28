@extends('layouts.main')


@section('jumbotron')
<div class="jumbotron">
    <div class="container">
        <div class="participation__avatar">
            <a href="{{ $t->user->profileLink() }}">
                <img src="{{ $t->user->getAvatar() }}" class="img-circle" title ="{{ $t->user->getName() }}" alt="{{ $t->user->getName() }}">
            </a>
        </div>
        <h2 class="jumbotron__heading">{{ $t->name }}</h2>
        <h4 class="jumbotron__sub-heading">
            @foreach ($t->tagged as $tag)
                <a href="/tag/{{ $tag->slug }}" class="post-tag" title="" rel="tag">{{ $tag->name }}</a>
            @endforeach
            <span class="text-muted label-small last-updated">
                đăng vào {{ $t->date() }}
                | {{ $t->question->count() }} câu hỏi
                | {{ $t->thoigian }} phút
            </span></h4>
        <a href="/quiz/create" class="btn btn-primary">
            <i class="fa fa-plus"></i> Tạo đề thi mới
        </a>
    </div>
</div>
@endsection


@section('title')
    {{ trim($t->name) }}
@stop

{{--Body Section--}}
@section('body')
<div class="container">
    <div class="row" id="mainRow">
    @include('quiz.doContent')
    </div>
</div>
@stop

@section('script')
<script>
    var testId = $('input[name="test_id"]').val();
    var userHistoryId;
    var count = {{ $t->thoigian * 60 }};
    var counter;

    $(document).ready(function(){
    @if (\Auth::check())
        quizDoInt();
    @else
        $('#loginModal').modal({
            keyboard: false,
            backdrop : 'static'
        });
    @endif
});
</script>
@stop

