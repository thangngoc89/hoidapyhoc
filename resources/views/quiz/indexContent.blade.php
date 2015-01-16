<div class="lessons-nav lessons-nav--forum inline-nav">
     <div class="container">
         <ul class="lessons-nav__primary">
             <li class="{{ (Request::is('quiz')) ? 'active' : '' }}">
                 <a href="{{ URL::to('quiz') }}">Tất cả</a> </li>

             @if (\Auth::check())
             <li class="{{ (Request::is('quiz/hasHistory')) ? 'active' : '' }}">
                 <a href="{{ URL::to('quiz/hasHistory') }}">Đề bạn đã thi</a> </li>
             @endif
             @if ($filter == 'c')
             <li class="active">
                 <a href="{{ $category->link() }}">{{ $category->name }}</a> </li>
             @endif
              <li class="pull-right">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                      Môn học
                      <span class="caret"></span>
                  </a>
                  <ul class="dropdown-menu">
                      @foreach ($categories as $c)
                          {{--Don't show category that already shown above--}}
                          @if (! (($filter == 'c') && ($category->id == $c->id)) )
                          <li class="">
                              <a href="{{ $c->link() }}">{{ $c->name }}</a> </li>
                          @endif
                      @endforeach
                  </ul>
              </li>
         </ul>

     </div>
 </div>
 <div class="wrap">
     @foreach ($tests as $t)
         <article class="media media--conversation @if (!in_array($t->id, $doneTestId)) updated @endif">
             <div class="media--conversation__avatar">
                 <a href="{{ $t->user->profileLink() }}">
                     <img class="media-object media--conversation__object" src="{{ $t->user->getAvatar() }}" alt="{{ $t->user->getName() }}">
                 </a>
             </div>

             <div class="media-body media--conversation__body">
                 <h5 class="media-heading media--conversation__heading">
                     <a href="{{ $t->link() }}" title="{{ $t-> name }}">{{ $t->name }}</a>
                 </h5>
                 <a href="{{ $t->category->link() }}" class="btn btn-forum" style="color: #000;background-color:#{{ $t->category->color }}">
                     {{ $t->category->name }}
                 </a>
                 <span class="text-muted label-small last-updated">
                     đăng vào <a href="{{ $t->link() }}">{{ $t->date() }}</a>
                     | <a href="{{ $t->link() }}">{{ $t->question->count() }}</a> câu hỏi
                     | <a href="{{ $t->link() }}">{{ $t->thoigian }}</a> phút
                 </span>
             </div>

             <div class="media--conversation__meta">
                 <span class="media--conversation__replies">
                     <a href="{{ $t->link() }}">{{ $t->countHistory() }}</a>lượt thi
                 </span>
             </div>
         </article>
     @endforeach
     {{--<div class="forum-pagination">--}}
         {{--<ul class="pagination">--}}
             {{--{{ $paging }}--}}
         {{--</ul>--}}
     {{--</div>--}}
 </div>