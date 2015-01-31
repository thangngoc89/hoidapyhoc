<!DOCTYPE html>
<html lang="vi">

    @include('partials.header')
    <body class="forum">
    {{--<div>--}}
        {{--<form method="GET" action="https://laracasts.com/search" accept-charset="UTF-8" class="global-search" style="display: block;">--}}
            {{--<input autocomplete="off" placeholder="Search..." name="q" type="search">--}}
            {{--<select name="q-where" id="q-where" class="hide">--}}
                {{--<option value="lessons">Lessons</option>--}}
            {{--</select>--}}
        {{--</form>--}}
        {{--<div class="search-content">--}}
            {{--something--}}
        {{--</div>--}}
    {{--</div>--}}

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
