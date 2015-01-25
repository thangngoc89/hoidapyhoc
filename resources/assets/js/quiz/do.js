function quizDoInt()
{
    resize_do();
    $(window).on('resize', (function(){
        resize_do();
    }))
    .on('scroll', (function(){
        resize_do();
    }));
    $('#btnSheet').on('click', function(){
        $('.quiz-sidebar-section').slideToggle();
    });
    $('.icontest-option').on('click', function(event){
        event.preventDefault();
        toastr.info('Hãy nhấn bắt đầu để làm bài');
    });

    $('#btnSubmit').on('click',function(){
        submitTest();
    });

    $('#btnStart').on('click',function(){

        $('.icontest-option').off('click');
        $('#quiz-content').removeClass('hide');
        $('#quiz-rule').hide();

        $('#btnSubmit').show();
        $('#btnStart').hide();

        sticky();

        toastr.info('Bắt đầu làm bài thôi nào ^_^');
        choiceDo();
        setCounter();
    })
}
function setCounter(){
    counter = setInterval(timer, 1000);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: '/api/v2/tests/'+testId+'/start',
        data: {
            'test_id': testId
        },
        success: function(data){
            userHistoryId = data.user_history_id;
        }

    });

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
            'user_history_id': userHistoryId,
            'test_id': testId,
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
                    closeOnConfirm: true,
                    closeOnCancel: true
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
    });
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