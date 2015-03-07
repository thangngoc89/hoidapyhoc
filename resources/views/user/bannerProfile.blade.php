<div class="banner banner-profile">
    <div class="container">
         <a href="{{ $user->profileLink() }}">
            <img src="{{ $user->getAvatar() }}" class="profile__avatar" alt="{{ $user->username }}">
         </a>
        <ul class="naked banner-profile__links">
            <li>
                <a href="{{ $user->profileLink() }}">{{ "@" . $user->username }}</a>
            </li>
            @foreach ($user->profiles as $p)
                <li>
                    <a href="{{ $p->profileURL }}">{{ $p->provider }}</a>
                </li>
            @endforeach
        </ul>
    </div>
</div>
<div class="profile__stats">
    <div class="container">
        <h2 class="wow fadeInUp profile__name animated" style="visibility: visible; -webkit-animation: fadeInUp;">
            <a href="{{ $user->profileLink() }}">{{ $user->getName() }}</a>
        </h2>
        <ul>
            <li>
                <strong class="profile__stats-heading">Lượt thi</strong>
                <span class="profile__stats-count">{{ $user->history->count() }}</span>
            </li>

            <li class="profile__stats-join-date">
                <strong class="profile__stats-heading">Tham gia từ</strong>
                <span class="profile__stats-count">{{ $user->joined() }}</span>
            </li>
        </ul>
    </div>
</div>