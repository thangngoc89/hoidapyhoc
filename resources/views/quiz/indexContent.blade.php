<div class="lessons-nav lessons-nav--forum inline-nav">
     <div class="container">
         <ul class="lessons-nav__primary">
             <li class="{{ (\Input::get('tab') == '' && \Request::is('quiz')) ? 'active' : '' }}">
                 <a href="/quiz">Mới nhất</a> </li>

             @if (\Auth::check())
             <li class="{{ \Input::get('tab') == 'yourExam' ? 'active' : '' }}">
                  <a href="/quiz?tab=yourExam">Đề thi đã gửi</a> </li>

             <li class="{{ (\Input::get('tab') == 'done') ? 'active' : '' }}">
                 <a href="/quiz?tab=done">Đề bạn đã thi</a> </li>
             @endif
             <li class="{{ (\Request::is('tag*')) ? 'active' : '' }}">
                  <a href="/tag">Tag</a></li>
         </ul>

     </div>
</div>
<div class="wrap">

    @if (! count($exams))
        <h3>Không tìm thấy đề thi nào</h3>
    @else

        @foreach ($exams as $exam)
            <article class="media media--conversation
                {{--If user done this test then make it grey--}}
                @if (!($doneTestId['doneTestId']) || !in_array($exam->id, $doneTestId['doneTestId']))
                updated
                @endif">
                 <div class="media--conversation__avatar">
                     <a href="{{ $exam->user->profileLink() }}">
                         <img class="media-object media--conversation__object" src="{{ $exam->user->getAvatar() }}" alt="{{ $exam->user->getName() }}">
                     </a>
                 </div>

                 <div class="media-body media--conversation__body">
                     <h5 class="media-heading media--conversation__heading">
                         <a href="{{ $exam->present()->link }}" title="{{ $exam->name }}">{{ str_limit($exam->name,45) }}</a>
                     </h5>
                     @foreach ($exam->tagged as $examTag)
                        <a href="{{ $examTag->present()->link }}" class="post-tag" title="" rel="tag">{{ $examTag->name }}</a>
                     @endforeach
                     <span class="text-muted label-small last-updated">
                         đăng vào <a href="{{ $exam->present()->link }}">{{ $exam->present()->createdDate }}</a>
                         &nbsp;
                         <a href="{{ $exam->present()->link }}" title="{{ $exam->questionsCount }} câu hỏi">
                            <i class="fa fa-puzzle-piece"></i> {{ $exam->questionsCount }}</a>
                         &nbsp; <a href="{{ $exam->present()->link }}" title="{{ $exam->thoigian }} phút"><i class="fa fa-clock-o"></i> {{ $exam->thoigian }}</a>
                     </span>
                 </div>

                 <div class="media--conversation__meta">
                     <span class="media--conversation__replies">
                         <a href="{{ $exam->present()->link }}">{{ $exam->countHistory() }}</a>lượt thi
                     </span>
                 </div>
                <div class="media--conversation__meta hide-mobile">
                     <span class="media--conversation__replies">
                         <a href="{{ $exam->present()->link }}">{{ $exam->views }}</a>lượt xem
                     </span>
                </div>
            </article>
         @endforeach

     @endif
    <div class="forum-pagination">
        <ul class="pagination">
            {!! $exams->render() !!}
        </ul>
    </div>
</div>