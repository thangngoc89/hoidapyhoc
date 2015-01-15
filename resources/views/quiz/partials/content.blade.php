<div id="quiz-info">
Đăng bởi : <a href="{{ $t->user->getProfile() }}"><strong>{{ $t->user->name}}</strong></a>
@if ($t->description)
   <blockquote>
       <p>
       {{ $t->description }}
       </p>
   </blockquote>
   @endif
</div>
<div id="quiz-content">

    @if ($t->is_file)
        <span class="color-red"><b>Chú ý: &nbsp;</b></span>
        <a href="http://ask.hoidapyhoc.com/t/sua-loi-khong-tai-duoc-de-thi/1167">Nếu bị lỗi tải đề thi , nhấp vào đây để khắc phục</a>
        <iframe width="100%" height="750px" class="documentViewer" src="{{ Config::get('quiz.pdf_viewer') }}{{ Config::get('quiz.pdf_base') }}{{ $t->file->first()->filename }}" __idm_frm__="22"></iframe>
    @else
        {{ $t->content }}
    @endif
</div>
<br/><br/><br/>
<h1 style="text-align :center">-- Hết --</h1>