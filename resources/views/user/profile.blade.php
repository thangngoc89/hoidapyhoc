@extends('layouts.main')


@section('jumbotron')
    @include('user.bannerProfile')
@stop

@section('title')
{{ $user->name }}
@stop

@section('meta_description')
Trang cá nhân - {{ $user->name }}
@endsection

@section('body')
<div class="container wrap">
    <h2 class="section-heading">Bài thi gần đây</h2>

    <span class="section-heading-divider"></span>
    <div class="threads-inner profile-forum-participation">
    @if ($history->count() > 0)
        @foreach ($history as $h)
            <article class="media media--conversation">
                <div class="media--conversation__avatar">
                    <a href="{{ $user->profileLink() }}">
                        <img class="media-object media--conversation__object" src="{{ $user->getAvatar() }}" alt="{{ $user->username }}">
                    </a>
                </div>
                <div class="media-body media--conversation__body">
                    <h5 class="media-heading media--conversation__heading">
                        {{ $h->updated_at->diffForHumans() }},
                        <a href="{{ $user->profileLink() }}">{{ $user->getName() }}</a>
                        đã làm đề thi
                        <a href="{{ $h->exam->present()->link }}">
                        {{$h->exam->name}}</a>
                    </h5>
                    <p>
                        @foreach ($h->exam->tagged as $tag)
                            <a href="{{ $tag->present()->link }}" class="post-tag" title="" rel="tag">{{ $tag->name }}</a>
                        @endforeach đạt
                        {{ $h->score }}/<strong>{{ $h->exam->questionsCount }}</strong> điểm.
                    </p>
                </div>

                <div class="media--conversation__meta">
                    <span class="label label-info">
                        <a href="{{ $h->exam->present()->link }}">Làm ngay</a>
                    </span>
                </div>
            </article>
        @endforeach
    @else
        <p>Không tìm thấy thông tin</p>
    @endif
    </div>

    <h2 class="section-heading">Bài thi đã đăng</h2>

    <span class="section-heading-divider"></span>
    <div class="threads-inner profile-forum-participation">
    @if ($postedExams->count() > 0)
        @foreach ($postedExams as $exam)
            <article class="media media--conversation">
                <div class="media--conversation__avatar">
                    <a href="{{ $user->profileLink() }}">
                        <img class="media-object media--conversation__object" src="{{ $user->getAvatar() }}" alt="{{ $user->username }}">
                    </a>
                </div>
                <div class="media-body media--conversation__body">
                    <h5 class="media-heading media--conversation__heading">
                        {{ $exam->present()->createdDate }},
                        <a href="{{ $user->profileLink() }}">{{ $user->getName() }}</a>
                        đã đăng đề thi
                        <a href="{{ $exam->present()->link }}">
                        {{$exam->name}}</a>
                    </h5>
                    <p>
                        @foreach ($exam->tagged as $tag)
                            <a href="{{ $tag->present()->link }}" class="post-tag" title="" rel="tag">{{ $tag->name }}</a>
                        @endforeach
                    </p>
                </div>

                <div class="media--conversation__meta">
                    <span class="label label-info">
                        <a href="{{ $h->exam->present()->link }}">Làm ngay</a>
                    </span>
                </div>
            </article>
        @endforeach
    @else
        <p>Không tìm thấy thông tin</p>
    @endif
    </div>
</div>
@stop