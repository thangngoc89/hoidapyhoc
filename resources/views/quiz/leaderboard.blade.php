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
            <a href="{{ $t->category->link() }}" class="btn btn-forum" style="color: #000;background-color:#{{ $t->category->color }}">
                {{ $t->category->name }}
            </a>
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
Bảng điểm :: {{ trim($t->name) }}
@stop

{{--Body Section--}}
@section('body')
<div class="container">
    <div class="col-md-8 threads-inner white">
        <div class="wrap" style="padding-top: 0">
            <div class="lessons-nav lessons-nav--forum inline-nav" style="margin-bottom: 3em;">
                 <div class="container">
                     <ul class="lessons-nav__primary">
                         <li>
                             <a href="{{ $t->link() }}">Đề thi</a>
                         </li>
                         <li class="active">
                            <a href="{{ $t->link('bangdiem') }}">Bảng điểm</a>
                         </li>
                     </ul>
                 </div>
             </div>
        @if (!$top->count())
        <h3>Đề này chưa có ai làm. Hãy <a href="{{ $t->link() }}" class="red">làm ngay</a></h3>
        @else
            @foreach($top as $index => $h)
            <article class="media media--conversation">
                <div class="media--conversation__avatar">
                    <a href="{{ $h->user->profileLink() }}">
                        <img class="media-object media--conversation__object" src="{{ $h->user->getAvatar() }}" alt="">
                    </a>
                    <span class="media--conversation__answered-icon media--conversation__answered-icon--alternate">
                        {{ $index+1+(\Input::get('page')-1)*50 }}
                    </span>
                </div>
                <div class="media-body media--conversation__body">
                    <h5 class="media-heading media--conversation__heading">
                        <a href="{{ $h->user->profileLink() }}">{{ $h->user->username }}</a>
                        {{--<small>— London, UK</small>--}}
                    </h5>
                    <ul class="leaderboard__stats">
                        <li>{{ $h->user->name }}</li>
                    </ul>
                </div>
                <div class="media--conversation__meta">
                    <span class="media--conversation__replies">
                        <span class="experience-points">{{ $h->score }}</span>
                        <span class="experience-heading">/{{ $t->question->count() }}</span>
                    </span>
                </div>
            </article>
            @endforeach
        @endif
        </div>
        <div class="forum-pagination">
             <ul class="pagination">
                 {!! $top->render() !!}
             </ul>
         </div>
    </div>
    <div id="conversations-sidebar" class="white col-md-4">
        @include('quiz.indexSidebar')
    </div>
</div>

@stop

