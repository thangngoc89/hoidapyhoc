@extends('layouts.main')


@section('jumbotron')
    @include('user.bannerProfile')
@stop

@section('title')
{{ $user->name }}
@stop

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
                        <a href="{{ $h->test->link() }}">{{$h->test->name}}</a>
                    </h5>
                    <p>
                        @foreach ($h->test->tagged as $tag)
                            <a href="/tag/{{ $tag->slug }}" class="post-tag" title="" rel="tag">{{ $tag->name }}</a>
                        @endforeach đạt
                        {{ $h->score }}/<strong>{{ $h->test->question->count() }}</strong> điểm.
                    </p>
                </div>

                <div class="media--conversation__meta">
                    <span class="label label-info">
                        <a href="{{ $h->test->link() }}">Làm ngay</a>
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