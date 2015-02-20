<div>
@if (!$top->count())
<h3>Đề này chưa có thành viên làm. Hãy làm ngay đi nào</h3>
@else
    @foreach($top as $index => $h)
    <article class="media media--conversation">
        <div class="media--conversation__avatar">
            <a href="{{ $h->user->profileLink() }}">
                <img class="media-object media--conversation__object" src="{{ $h->user->getAvatar() }}" alt="">
            </a>
            <span class="media--conversation__answered-icon media--conversation__answered-icon--alternate">
            <?php
                $page = \Input::get('page');
                $offset = ($page) ? $page-1: 0;
            ?>
                {{ $index+1+ $offset*50 }}
            </span>
        </div>
        <div class="media-body media--conversation__body">
            <h5 class="media-heading media--conversation__heading">
                <a href="{{ $h->user->profileLink() }}">{{ $h->user->username }}</a>
            </h5>
            <ul class="leaderboard__stats">
                <li>{{ $h->user->name }}</li>
            </ul>
        </div>
        <div class="media--conversation__meta">
            <span class="media--conversation__replies">
                <span class="experience-points">{{ $h->score }}</span>
                <span class="experience-heading">/{{ strlen($h->answer) }}</span>
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