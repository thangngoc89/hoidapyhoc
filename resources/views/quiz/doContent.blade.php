<div class="col-md-8 threads-inner white">
    <div class="lessons-nav lessons-nav--forum inline-nav">
         <div class="container">
             <ul class="lessons-nav__primary" role="tablist">
                 <li role="presentation" class="active">
                    <a href="#doContent" aria-controls="doContent" role="tab" data-toggle="tab">
                        <i class="icon-box-3"></i> Đề thi</a> </li>
                 <li role="presentation">
                    <a href="#leaderBoard" aria-controls="leaderBoard" role="tab" data-toggle="tab">
                        <i class="icon-award-4"></i> Bảng điểm</a> </li>
                 {{--<li role="presentation">--}}
                    {{--<a href="#comment" aria-controls="comment" role="tab" data-toggle="tab">--}}
                        {{--<i class="icon-chat-4"></i> Bình luận</a> </li>--}}

                 @if ( \Auth::check())
                    @if (\Auth::user()->can('manage_exams') || \Auth::user()->id == $t->user_id )
                 <!-- Edit button -->
                         <li class="pull-right">
                            <a href="{{ $t->link('edit') }}">
                                <i class="icon-pencil-3"></i> Sửa</a> </li>
                    @endif
                 @endif
             </ul>
         </div>
     </div>
    @include('components.socialButtons')
     <!-- Place this tag where you want the +1 button to render. -->
    <div class="wrap tab-content">

        <!-- Main Exam Content -->
        <div role="tabpanel" class="tab-pane fade in active" id="doContent">
            @include('quiz.partials.content')
        </div>
        <!-- Leader Board Tab -->
        <div role="tabpanel" class="tab-pane fade" id="leaderBoard">

        </div>
        {{--<!-- Facebook Comment -->--}}
        {{--<div role="tabpanel" class="tab-pane fade" id="comment">--}}
            {{--<div class="fb-comments"--}}
                {{--data-href="{{ \Request::url() }}"--}}
                {{--data-numposts="10"--}}
                {{--data-colorscheme="light"--}}
                {{--data-width="100%">--}}
            {{--</div>--}}
        {{--</div>--}}
    </div>
</div>
<div id="quiz-sidebar" class="col-md-4 white">
    <div class="quiz-nav lessons-nav--forum inline-nav">
        <div class="container">
            <ul class="quiz-nav__primary">
                 <li class="active">
                    <a><span class="timecou">
                        {{ date('H:i', mktime(0,$t->thoigian)) }}:00
                    </span></a>
                 </li>
                 <li id="quiz-nav--forum__rankings" class="pull-right">
                     <button id="btnStart" type="button" class="btn btn-primary">Bắt đầu</button>
                     <button id="btnSubmit" type="button" class="btn btn-primary" data-loading-text="Đang xử lí..." disabled="disabled" >Nộp bài</button>
                     <button id="btnSheet" type="button" class="btn btn-primary"><i class="fa fa-th-list"></i></button>
                 </li>

             </ul>
        </div>
    </div>
    @if (\Auth::check())
    <div class="quiz-sidebar-section">
        <div class="statistic-box testHeader">
            <div class="userAnswerCount" value="0">
                <strong>Phần trả lời: </strong>
                <span id="answeredCount">0</span>
                /
                <span id="totalAnswer">{{ $t->questionsCount }}</span>
            </div>
        </div>
        <div class="answer-box option_test" id="option_test">
            <form id="frmTest" action="/api/v2/exams/{{$t->id}}/check" method="POST">
                <table width="100%" border="0">
                <tbody>
                <?php $i=$t->begin; ?>
                @foreach( $t->questions as $q)
                <tr class="questionRow table-back01 unanswered " data-question-order="{{$i}}">
                    <td align="center" class="questionNumber">{{$i}}.</td>
                    <td><a id="a_{{$i}}_a" rel="1" class="icontest-option op-a " href="#">a</a>
                        <input type="hidden" id="answer_{{$i}}_a" name="answer_{{$i}}_1" value="0">
                    </td>
                    <td><a id="a_{{$i}}_b" rel="1" class="icontest-option op-b " href="#">b</a>
                        <input type="hidden" id="answer_{{$i}}_b" name="answer_{{$i}}_2" value="0">
                    </td>
                    <td><a id="a_{{$i}}_c" rel="1" class="icontest-option op-c " href="#">c</a>
                        <input type="hidden" id="answer_{{$i}}_c" name="answer_{{$i}}_3" value="0">
                    </td>
                    <td><a id="a_{{$i}}_d" rel="1" class="icontest-option op-d " href="#">d</a>
                        <input type="hidden" id="answer_{{$i}}_d" name="answer_{{$i}}_4" value="0">
                    </td>
                    <td><a id="a_{{$i}}_e" rel="1" class="icontest-option op-e " href="#">e</a>
                        <input type="hidden" id="answer_{{$i}}_d" name="answer_{{$i}}_5" value="0">
                    </td>
                </tr>
                <?php $i++; ?>
                @endforeach
                </tbody>
                </table>
                <input type="hidden" name="test_id" value="{{ $t->id }}">
            </form>
            <div id="resultForm"></div>
        </div>
    </div>
    @endif
</div>

