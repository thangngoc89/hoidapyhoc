<div class="lessons-nav lessons-nav--forum inline-nav">
     <div class="container">
         <ul class="lessons-nav__primary">
             <li class="{{ (Request::is('quiz')) ? 'active' : '' }}">
                 <a href="/quiz">Tất cả</a> </li>

             @if (\Auth::check())
             <li class="{{ (Request::is('quiz/hasHistory')) ? 'active' : '' }}">
                 <a href="/quiz/hasHistory">Đề bạn đã thi</a> </li>
             @endif
         </ul>

     </div>
 </div>
 <div class="wrap">
     @foreach ($tests as $t)
         <article class="media media--conversation
            {{--If user done this test then make it grey--}}
            @if (!($doneTestId) || !in_array($t->id, $doneTestId))
            updated
            @endif">
             <div class="media--conversation__avatar">
                 <a href="{{ $t->user->profileLink() }}">
                     <img class="media-object media--conversation__object" src="{{ $t->user->getAvatar() }}" alt="{{ $t->user->getName() }}">
                 </a>
             </div>

             <div class="media-body media--conversation__body">
                 <h5 class="media-heading media--conversation__heading">
                     <a href="{{ $t->link() }}" title="{{ $t-> name }}">{{ str_limit($t->name,50) }}</a>
                 </h5>
                 @foreach ($t->tagList() as $tag)
                    <a href="/tag/{{ $tag->slug }}" class="post-tag" title="" rel="tag">{{ $tag->name }}</a>
                 @endforeach
                 <span class="text-muted label-small last-updated">
                     đăng vào <a href="{{ $t->link() }}">{{ $t->date() }}</a>
                     - <a href="{{ $t->link() }}" title="{{ $t->totalQuestions() }} câu hỏi"><i class="fa fa-puzzle-piece"></i> {{ $t->totalQuestions() }}</a>
                     - <a href="{{ $t->link() }}" title="{{ $t->thoigian }} phút"><i class="fa fa-clock-o"></i> {{ $t->thoigian }}</a>
                 </span>
             </div>

             <div class="media--conversation__meta">
                 <span class="media--conversation__replies">
                     <a href="{{ $t->link() }}">{{ $t->countHistory() }}</a>lượt thi
                 </span>
             </div>
         </article>
     @endforeach
     <div class="forum-pagination">
         <ul class="pagination">
             {!! $tests->render() !!}
         </ul>
     </div>
 </div>