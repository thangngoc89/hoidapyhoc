<div class="lessons-nav lessons-nav--forum inline-nav">
     <div class="container">
         <ul class="lessons-nav__primary">
             <li class="{{ (\Input::get('tab') == '' && \Request::is('quiz')) ? 'active' : '' }}">
                 <a href="/quiz">Mới nhất</a> </li>

             @if (\Auth::check())
             <li class="{{ (\Input::get('tab') == 'done') ? 'active' : '' }}">
                 <a href="/quiz?tab=done">Đề bạn đã thi</a> </li>
             @endif
             <li class="{{ (\Request::is('tag*')) ? 'active' : '' }}">
                  <a href="/tag">Tag</a></li>
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
                     <a href="{{ $t->link() }}" title="{{ $t-> name }}">{{ str_limit($t->name,45) }}</a>
                 </h5>
                 @foreach ($t->tagged as $tag)
                    <a href="/tag/{{ $tag->slug }}" class="post-tag" title="" rel="tag">{{ $tag->name }}</a>
                 @endforeach
                 <span class="text-muted label-small last-updated">
                     đăng vào <a href="{{ $t->link() }}">{{ $t->created_at->diffForHumans() }}</a>
                     &nbsp; <a href="{{ $t->link() }}" title="{{ $t->questionsCount() }} câu hỏi"><i class="fa fa-puzzle-piece"></i> {{ $t->questionsCount() }}</a>
                     &nbsp; <a href="{{ $t->link() }}" title="{{ $t->thoigian }} phút"><i class="fa fa-clock-o"></i> {{ $t->thoigian }}</a>
                 </span>
             </div>

             <div class="media--conversation__meta">
                 <span class="media--conversation__replies">
                     <a href="{{ $t->link() }}">{{ $t->countHistory() }}</a>lượt thi
                 </span>
             </div>
             <div class="media--conversation__meta hide-mobile">
                  <span class="media--conversation__replies">
                      <a href="{{ $t->link() }}">{{ $t->views }}</a>lượt xem
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