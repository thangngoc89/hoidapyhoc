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
                đăng vào {{ $t->created_at->diffForHumans() }}
                | {{ $t->questionsCount }} câu hỏi
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

@section('meta_description')
<?php
    $meta_desc = str_limit(strip_tags($t->content), 600);
    $meta_desc = str_replace('  ',' ',$meta_desc);
?>
    @if (!empty($t->description))
            {{ $t->description }}
    @elseif (!$t->is_file && strlen($meta_desc) > 0)
        {{ $meta_desc }}
    @else
        Đề thi {{ $t->name }} - Làm đề thi trắc nghiệm Y Học Online. Kho đề thi trắc nghiệm Y Học lớn nhất
    @endif
@endsection


@section('meta_author')
    {{ $t->user->getName() }}
@endsection

@section('header')
    <meta name="pubdate" content="{{ $t->updated_at->format('c') }}" />
    @foreach($t->tagged as $tag)
    <meta property="og:article:tag" content="{!! $tag->name !!}" />
    @endforeach

@endsection

{{--Body Section--}}
@section('body')
<div class="container">
    {!! Breadcrumbs::render('quiz.do', $t) !!}

    <div class="row" id="mainRow">
    @include('quiz.doContent')
    </div>
    <div class="row">
        <div class="col-md-12 white related-exams">
            <div class="lessons-nav lessons-nav--forum inline-nav">
                <div class="container">
                    <ul class="lessons-nav__primary">
                        <li class="active">
                            <a href="#related-exams">
                                <span id="related-exams">Đề thi ngẫu nhiên</span></a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="related-exams__content">
                <ol>
                    @foreach($relatedExams as $relatedExam)
                    <li>
                        <a href="{{ $relatedExam->present()->link }}">
                        {{ $relatedExam->name }}
                        </a>
                    </li>
                    @endforeach
                </ol>
            </div>
        </div>
    </div>
</div>
@stop

@section('script')
<script>
// TODO: move this vars into global var
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

