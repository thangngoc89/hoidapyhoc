<!DOCTYPE html>
<html lang="vi">

    @include('partials.header')
    <body class="forum">
        <div class="page sidebar-nav--close logged-in">
            @include('partials.nav')
            @yield('jumbotron')

            <div class="container">
                <div class="row">
                    @yield('body')
                </div>
            </div>

            <footer id="footer" class="wrap">
                @include('partials.footer')
            </footer>
        </div>
        @include('partials.script')
    </body>
</html>
