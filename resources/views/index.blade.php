@section('title')
Trang chủ
@stop
<!DOCTYPE html>
<html lang="vi">

    @include('partials.header')
    <body class="home">
        <div class="page sidebar-nav--close  logged-in">
            @include('partials.nav')

<div class="home-banner">
        <h2 class="wow bounceInDown" class="search-toggle">
            Vì cộng đồng sinh viên Y Khoa
        </h2>

        <h1 id="home-learn-next-choices">
            <a href="/quiz">
                Kho đề thi Y Khoa cực lớn
            </a>
        </h1>

        <a href="/quiz" class="btn btn-join">
            Tìm hiểu ngay
        </a>
</div>
<div class="piece">
    <div class="container wrap">
        <h2 class="section-heading">Những ứng dụng hữu ích giúp đỡ sinh viên</h2>
        <span class="section-heading-divider"></span>

        @include('index.indexLession')
    </div>
</div>


<!-- RENAISSANCE -->
<div id="buy-lunch">
    <div class="text-center container wrap">
        <h2 class="wow fadeIn alone">
            <a href="/auth/login">Tham gia ngay</a> để cùng nhau xây dựng một cộng đồng sinh viên Y Khoa lớn mạnh.
        </h2>
    </div>
</div>


<!-- TESTIMONIALS -->
<div class="testimonials" id="home-reviews">
    <div class="container wrap wow fadeIn">

    <h2 class="section-heading">
        <a href="/testimonials">Mọi người nói gì về Hỏi Đáp Y Học.</a>    </h2>

    <span class="section-heading-divider"></span>

    @include('index.indexTestimonials')

    <h3 class="text-center zeroed"><a href="/testimonials">Còn nhiều lắm, xem tiếp nào.</a></h3>
    </div>
</div>

<div class="piece" id="meet-jeffrey">
    <div class="container wrap">
        <div class="col-md-8 col-md-offset-2">
            <div class="col-md-3">
                <img src="//www.gravatar.com/avatar/a8915a67cbc1917c7a1404a1889c701c?s=200" class="avatar">
            </div>

            <div class="col-md-9">
                <h2 class="pulse">Chào mọi người !</h2>

                <p>
                    Mình là Khoa và đam mê lập trình.
                    Mình tạo ra trang web này nhằm giúp sinh viên Y Khoa tụi mình học bài mọt cách hiệu quả hơn,
                    không còn thi xong mà vẫn không biết câu trả lời,
                    hay tốn quá nhiều sức khi đánh đề trắc nghiệm (học thuộc ý mà).
                    Mình mong các bạn sẽ cùng với mình xây dựng một cộng dồng sinh viên Y Khoa vững mạnh.
                    Để bắt đầu, hãy tham gia <a href="//ask.hoidapyhoc.com">cộng đồng Hỏi Đáp</a>
                    hoặc ứng dụng <a href="/quiz">Quiz</a> nhé.
                </p>
            </div>
        </div>
    </div>
</div>


<!-- GET GOING -->
<div class="text-center piece" id="level-up">
    <div class="container wrap">
        <h2 class="wow pulse alone">
            <a href="/quiz">Khám phá Quiz</a> và <a href="/auth/login">tham gia cùng chúng tớ!</a>
        </h2>
    </div>
</div>

            <footer id="footer" class="wrap">
                @include('partials.footer')
            </footer>
        </div>
        <!-- close page div -->

        @include('partials.script')
    </body>
</html>