@extends('layouts.main')


@section('jumbotron')
<div class="jumbotron">
    <div class="container">
        <div class="participation__avatar">
            <a href="{{ $t->user->profileLink() }}">
                <img src="{{ $t->user->getAvatar() }}" class="img-circle" title ="{{ $t->user->getName() }}" alt="{{ $t->user->getName() }}">
            </a>
        </div>
        <h2 class="jumbotron__heading">{{ $t->name }}</h2>
        <h4 class="jumbotron__sub-heading">
            <a href="{{ $t->category->link() }}" class="btn btn-forum" style="color: #000;background-color:#{{ $t->category->color }}">
                {{ $t->category->name }}
            </a>
            <span class="text-muted label-small last-updated">
                đăng vào {{ $t->date() }}
                | {{ $t->question->count() }} câu hỏi
                | {{ $t->thoigian }} phút
            </span></h4>
        <a href="/quiz/create" class="btn btn-primary">
            <i class="icon-bubble-chat-1"></i> Tạo đề thi mới
        </a>
    </div>
</div>
@endsection


@section('title')
    {{ trim($t->name) }}
@stop

{{--Body Section--}}
@section('body')
<div class="container">
    <div class="row">
    @include('quiz.doContent')
    </div>
</div>
@stop

@section('script')
<script>
var count = {{ $t->thoigian * 60 }};
var counter;
$(document).ready(function(){
    @if ($history)
        // TODO: Only Trigger counter when fully loaded
        $("#quiz-sidebar, .threads-inner").stick_in_parent();
        $('#frmTest').ajaxForm({
    //        target: '#resultForm'
        });
        $('#btnSubmit').on('click',function(){
           submitTest();
        });
        choiceDo();
        setCounter();
    @else
        $('#loginModal').modal({
            keyboard: false,
            backdrop : 'static'
        });
    @endif
});

</script>
<script>
    function setCounter(){
         counter = setInterval(timer, 1000); //1000 will  run it every 1 second
    }
    function timer() {
        count = count - 1;
        if (count == -1) {
            clearInterval(counter);
            sendSubmitTest();
            return;
        }

        var seconds = count % 60;
        var minutes = Math.floor(count / 60);
        var hours = Math.floor(minutes / 60);
        minutes %= 60;
        hours %= 60;

        $('.timecou').html(hours + ":" + minutes + ":" + seconds);
    }
    function submitTest(){
        swal({
          title: "Bạn có muốn nộp bài chứ?",
          type: "warning",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          confirmButtonText: "Có!",
          closeOnConfirm: false
        },
        function(){
            sendSubmitTest();
        });
    }
    function sendSubmitTest(){
        $.ajax({
            type: "POST",
            dataType: "json",
            beforeSend: function(){
                $("#btnSubmit").button('loading');
            },
            url: $('#frmTest').attr('action'),
            data: {
                'user_history_id': $('input[name="user_history_id"]').val(),
                'test_id': $('input[name="test_id"]').val(),
                'answers': gatherAnswer()
            },
            error: function(data){
                console.log(data.responseText);
                toastr.error('Có lỗi xảy ra. Vui lòng kiểm tra kĩ và thử lại');
            },
            success: function(data){

                swal({
                  title: "Bạn làm đúng "+data.score+'/'+data.totalQuestion+' câu hỏi',
                  text: "Bạn có muốn xem lại kết quả chi tiết chứ?",
                  type: "success",
                  showCancelButton: true,
                  confirmButtonClass: "btn-info",
                  confirmButtonText: "Có chứ!",
                  cancelButtonText: "Không, để làm lại!",
                  closeOnConfirm: false,
                  closeOnCancel: false
                },
                function(isConfirm) {
                  if (isConfirm) {
                    location.href = data.url;
                  } else {
                    location.href = location.href;
                  }
                });
            }
        });
    }
    function gatherAnswer(){
        var answers= [];
        $('.questionRow').each(function(){
            questionId = $(this).data('question-id');
            questionOrder = $(this).data('question-order');
            givenAnswer = $('input[id^="answer_'+questionOrder+'_"][value=1]').attr('name');
            if (!givenAnswer)
            {
                givenAnswer = 0;
            } else {
                // Cut the final char (givenAnswer)
                 givenAnswer = givenAnswer.substring(givenAnswer.length-1, givenAnswer.length);
            }
//            answer = {
//                'qID' : questionId,
//                'a' : givenAnswer
//            };
            answers.push(givenAnswer);
        })
        return answers;
    }
    function choiceDo(){
        $('.icontest-option').on('click', function(event){
            event.preventDefault();
            questionId = $(this).data('question-id');
            questionRow = $(this).parent().parent();
//            Add class answered to row (for counting)
            questionRow.alterClass('unanswered','answered');
            questionOrder = questionRow.data('question-order');
//                console.log(questionId+'___'+questionOrder+'____'+$(this).html());

//                Alter all answer in the same question to default value
            var questionLink = $('a[id^="a_'+questionOrder+'_"]');
            var questionInput = $('input[id^="answer_'+questionOrder+'_"]');
//            Remove active class for answers in the same row
            questionLink.each(function(){
                $(this).alterClass('op-*','op-'+$(this).html());
            });
//            Reset input for answers in the same row
            questionInput.each(function(){
                $(this).val(0);
            });
//                Add class and value to current click element
            $(this).alterClass('op-*', 'op-choice');
            $(this).siblings().val(1);

            updateAnswerCount();
        });
    }
    function updateAnswerCount(){
        answered = $('tr.answered').length;

        $('#answeredCount').html(answered);
        $('.userAnswerCount').attr('value',answered);

        totalAnswer = parseInt($('#totalAnswer').html());
//        Only submit when answered half of questions
        if (answered >= (totalAnswer/2))
            $('#btnSubmit').attr('disabled',null);
    }
</script>
<script>
function resize_do(){
    width=parseInt($(window).width());
    scrollTop=parseInt($(window).scrollTop());
    if(width<=767){
        if(scrollTop>=100){
            $('#quiz-sidebar').addClass('quiz-side-fixed');
        }
        else{
            $('#quiz-sidebar').removeClass('quiz-side-fixed');
        }
    }
}
$(document).ready(function(){
    resize_do();
    $(window).resize(function(){
        resize_do();
    });
    $(window).scroll(function(){
        resize_do();
    });
    $('#btnSheet').on('click', function(){
        $('.quiz-sidebar-section').slideToggle();
    });
});

</script>
@stop


