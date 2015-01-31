<!DOCTYPE html>
<html lang="vi">

    @include('partials.header')
    <body class="forum">
        <div class="page sidebar-nav--close @if(\Auth::check())logged-in @endif">
            @include('partials.nav')
            @yield('jumbotron')

            @yield('body')

            <footer id="footer" class="wrap">
                @include('partials.footer')
            </footer>
        </div>
        @include('partials.script')
    </body>
</html>
