<nav class="navbar" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>

            <a href="{{ URL::to('/') }}" class="navbar-brand logo">Hỏi Đáp Y Học</a>
        </div>
        <!-- navbar-header -->

        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav">
                <li class="{{ (Request::is('quiz*') ? 'active' : '') }}">
                    <a href="/quiz" class="navbar-link">
                        <i class="fa fa-graduation-cap"></i> Quiz
                    </a>
                </li>
                <li class="">
                    <a href="//ask.hoidapyhoc.com" class="navbar-link">
                        <i class="icon-chat-4"></i> Diễn đàn
                    </a>
                </li>
            </ul>

            <ul class="nav navbar-nav navbar-right">
                @if (!Auth::check())
                <li>
                    <button type="button" class="navbar-link btn btn-join" data-toggle="modal" data-target="#loginModal">Đăng nhập</button>
                </li>
                @else
                <?php $user = Auth::user(); ?>
                <li class="dropdown" id="user-options">
                    <a href="#" class="dropdown-toggle navbar-link" data-toggle="dropdown">
                        {{ $user->name }} <b class="caret"></b>
                        <img src="{{ $user->getAvatar() }}" class="nav-gravatar" alt="{{ $user->getName() }}">
                    </a>

                    <ul class="dropdown-menu dropdown-with-icons">
                        <li>
                            <a href="{{ $user->profileLink() }}">
                                <i class="icon-profile-1"></i> Trang cá nhân
                            </a>
                        </li>
                        <li>
                            <a href="{{ Url::to('user') }}">
                                <i class="icon-link-2"></i> Thiết lập tài khoản
                            </a>
                        </li>
                        <li>
                            <a href="/auth/logout?return={{ Request::url() }}">
                                <i class="icon-log-out-1"></i> Thoát
                            </a>
                        </li>
                    </ul>
                </li>
                @endif
            </ul>
        </div>
        <!-- collapse -->
    </div>
    <!-- container -->
</nav>
<nav class="secondary-nav">
    <div class="container">
        <ul class="zeroed secondary-nav--left">

            <!-- Browse -->
            <li class="dropdown ">
                <a href="/quiz" class="navbar-link dropdown-toggle" data-toggle="dropdown">
            Khám phá <b class="caret"></b>
        </a>

                <ul class="dropdown-menu">
                    <li class=""><a href="/tag">Tags</a>
                    </li>
                </ul>
            </li>

            <!-- Deploy -->
            <li id="navbar-link--deploy">
                <a href="https://ask.hoidapyhoc.com" class="navbar-link" target="_blank">Diễn đàn</a>
            </li>

            <!-- Work -->
            <li id="navbar-link--work">
                <a class="navbar-link" href="/users" target="_blank">Thành viên</a>
            </li>
        </ul>
        <!-- Search -->
        <ul class="zeroed secondary-nav--right">
            <li>
                <div id="search-form">
                    <select id="q" name="q" placeholder="Nhập để tìm kiếm..." class="form-control"></select>
                </div>
            </li>
        </ul>
    </div>
</nav>