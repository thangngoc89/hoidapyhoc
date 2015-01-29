<div id="quiz-info">
Đăng bởi : <a href="{{ $t->user->profileLink() }}"><strong>{{ $t->user->name}}</strong></a>
@if ($t->description)
   <blockquote>
       <p>
       {!! $t->description !!}
       </p>
   </blockquote>
   @endif
</div>
@if (\Auth::check())
<div id="quiz-rule" class="@if (($viewHistory)) hide @endif">

    @if (isset($haveHistory) && (!is_null($haveHistory)))
        <h3 class="text-center">Bạn đã làm đề này {{ $haveHistory->count()  }} lần</h3>
        <ul>
        @foreach ($haveHistory  as $h)
            <li>
                <a href="{{ $h->link() }}">Bạn đạt {{ $h->score }}/{{ strlen($h->answer) }} điểm vào {{ $h->date() }}</a>
            </li>
        @endforeach
        </ul>
    @endif
    <h3 class="text-center" style="line-height:1.3em">Hãy nhấn <span class="color-red">BẮT ĐẦU</span> để làm bài</h3>
    <h3 class="color-red">* LƯU Ý</h3>
    <ul>
        <li>Hãy đợi bài thi tải xong rồi nhấn làm bài</li>
        <li>Số điểm lần đầu tiên làm bài sẽ có giá trị xếp hạng trong bài thi</li>
        <li>Số điểm của bài thi chỉ có giá trị xếp hạng trong bài thi</li>
        <li>Số điểm thi không được cộng vào điểm tổng</li>
        <li>Hãy cố gắn đứng đầu <i class="iconsprite-mini iconmini-rank"></i> <span class="color-red">BẢNG ĐIỂM</span> nhé </li>
    </ul>
    <h3 class="text-center">Chúc bạn <span class="color-red">MAY MẮN</span></h3>
</div>
<div id="quiz-content" class="@if (!$viewHistory) hide @endif">
    <div id="quiz-content-detail">
    @if ($t->is_file)
        <span class="color-red"><b>Chú ý: &nbsp;</b></span>
        <a href="http://ask.hoidapyhoc.com/t/sua-loi-khong-tai-duoc-de-thi/1167">Nếu bị lỗi tải đề thi , nhấp vào đây để khắc phục</a>
        <iframe
            width="100%"
            height="750px"
            class="documentViewer"
            src="{{ $t->file->pdfViewer() }}"
         ></iframe>
    @else
        {!! $t->content !!}
    @endif
    </div>
    <div class="the-end">
        <h1>-- Hết --</h1>
    </div>
</div>
@endif
