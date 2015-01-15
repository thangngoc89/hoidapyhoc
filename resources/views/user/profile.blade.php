@extends('......layouts.main')


@section('jumbotron')
    @include('bannerProfile')
@stop

@section('title')
{{ $user->name }}
@stop

@section('body')
<div class="container wrap">
    <h2 class="section-heading">Bài thi gần đây</h2>

    <span class="section-heading-divider"></span>
    <div class="threads-inner profile-forum-participation">
    <?php
        $history = History::where('user_id',$user->id)
                            ->with('test')
                            ->orderBy('created_at','DESC')
                            ->take(5)
                            ->get();

    ?>
    @if ($history->count() > 0)
        @foreach ($history as $h)
            <article class="media media--conversation">
                <div class="media--conversation__avatar">
                    <a href="{{ $user->getProfile() }}">
                        <img class="media-object media--conversation__object" src="{{ $user->getAvatar() }}" alt="{{ $user->username }}">
                    </a>
                </div>
                <div class="media-body media--conversation__body">
                    <h5 class="media-heading media--conversation__heading">
                        {{ $h->date() }},
                        <a href="{{ $user->getProfile() }}">{{ $user->getName() }}</a>
                        đã làm đề thi
                        <a href="{{ $h->test->link() }}">{{$h->test->name}}</a>
                    </h5>
                    <p>
                        <a href="{{ $h->test->category->link() }}" class="btn btn-forum" style="color: #000;background-color:#{{ $h->test->category->color }}">
                            {{ $h->test->category->name }}
                        </a> đạt
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