/**
 * jQuery alterClass plugin
 *
 * Remove element classes with wildcard matching. Optionally add classes:
 *   $( '#foo' ).alterClass( 'foo-* bar-*', 'foobar' )
 *
 * Copyright (c) 2011 Pete Boere (the-echoplex.net)
 * Free under terms of the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 */
(function ( $ ) {

    $.fn.alterClass = function ( removals, additions ) {

        var self = this;

        if ( removals.indexOf( '*' ) === -1 ) {
            // Use native jQuery methods if there is no wildcard matching
            self.removeClass( removals );
            return !additions ? self : self.addClass( additions );
        }

        var patt = new RegExp( '\\s' +
        removals.
            replace( /\*/g, '[A-Za-z0-9-_]+' ).
            split( ' ' ).
            join( '\\s|\\s' ) +
        '\\s', 'g' );

        self.each( function ( i, it ) {
            var cn = ' ' + it.className + ' ';
            while ( patt.test( cn ) ) {
                cn = cn.replace( patt, ' ' );
            }
            it.className = $.trim( cn );
        });

        return !additions ? self : self.addClass( additions );
    };

})( jQuery );
$(function() {
    $.ajaxSetup({
        headers: {
            'X-XSRF-Token': $('meta[name="csrf"]').attr('content')
        }
    });
});

toastr.options = {
    "closeButton": false,
    "debug": false,
    "progressBar": false,
    "positionClass": "toast-bottom-right",
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

function sticky()
{
    $("#quiz-sidebar, #mainRow").stick_in_parent();
}
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
function quizCreateInt()
{
    buttonListener();
    iconListener();

    $('#frmTest').on('submit', function(event)
    {
        event.preventDefault();
        post();
    });
    sticky();
    global.answerArray = [];
}


function post()
{
    data = validator();
    if (data)
    {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: '/api/v2/tests',
            data: data,
            error: function(data){
                data = $.parseJSON(data.responseText);
                if (data.name[0] == 'validation.unique')
                {
                    toastr.error('Tên đề thi đã được sử dụng. Vui lòng chọn một tên khác');
                    return false;
                }
                console.log(data);
                toastr.error('Có lỗi xảy ra. Vui lòng kiểm tra kĩ và thử lại');
            },
            success: function(data){
                console.log(data);
            }
        });
    }
}

function validator()
{
    if (!filledAllAnswer()) return false;
    name = editorName.serialize().name.value;
    description =  editorDescription.serialize().description.value,
    content =  editorContent.serialize().content.value,
    begin = $('begin').val();
    begin = (parseInt(begin) >= 1) ? parseInt(begin) : 1;

    category_id = $('#select-category').val();
    time = $('#select-time').val();

    if (!name || name.length < 6)
    {
        toastr['warning']('Tên đề thi tối thiểu 6 kí tự')
        return false;
    }
    if (!content)
    {
        toastr['warning']('Bạn chưa nhập nội dung đề thi');
        return false;
    }

    return {
        name: name,
        description: description,
        content: content,
        begin: begin,
        cid: category_id,
        thoigian: time,
        questions : gatherQuestion()
    }
}

function gatherQuestion(){
    var questions= [];
    $('.ansRow').each(function(index){
        questionOrder = $(this).data('question-order');
        givenAnswer = $('input[id^="answer_'+questionOrder+'_"][value=1]').attr('name');
        givenAnswer = givenAnswer.substring(givenAnswer.length-1, givenAnswer.length);
            question = {
                'right_answer' : givenAnswer.toUpperCase(),
                'content' : (global.answerArray[index+1]) ? global.answerArray[index+1] : '',
            };
        questions.push(question);
    });
    return questions;
}

function iconListener()
{
    // Init Test Icon
    choiceDo();
    answerModal();
    sticky();

}
function buttonListener()
{
    $('#btn-add').on('click', function(event)
    {
        event.preventDefault();
        addQuestion($('#total_add').val());
    });
    $('#btn-remove').on('click', function(event)
    {
        event.preventDefault();
        removeQuestion($('#total_remove').val());
    });
    $('#begin').on('keyup', function()
    {
        adjustBegin();
    })

}

function addQuestion(value)
{
    for(i=1; i<=value; i++)
    {
        qIndex = $('.ansRow:last').data('question-order');
        addNewRow(qIndex+1);
    }
    iconListener();
    totalQuestion();
    adjustBegin();
}

function removeQuestion(value)
{
    if (totalQuestion() - parseInt(value) <1)
    {
        toastr['warning']('Tổng số câu hỏi không được nhỏ hơn 1');
        return false;
    }
    qIndex = $('.ansRow:last').data('question-order');
    toIndex = parseInt(qIndex)-parseInt(value);

    for(i=qIndex; i>toIndex; i--)
    {
        console.log('delete '+i);
        $('tr[data-question-order="'+i+'"]').remove();
    }
    totalQuestion();

}

function addNewRow(index)
{
    row = '<tr class="ansRow" data-question-order="'+index+'">' +
    '<td align="center" class="questionNumber">'+index+'.</td>';

    ['a','b','c','d','e'].forEach(function(option)
        {
            row  += '<td><a id="a_'+index+'_'+option+'" rel="1" class="icontest-option op-'+option+'" href="#"">'+option+'</a>'+
            '<input type="hidden" id="answer_'+index+'_'+option+'" name="answer_'+index+'_'+option+'" value="0">'+
            '</td>';
        }
    );
    row += '<td><a href="javscript::void(0)" class="iconHint"><i class="zn-icon icon-hint"></i></a></td></tr>';

    $('#answer>tbody').append(row);
}

function adjustBegin()
{
    val = $('#begin').val();
    val = (parseInt(val) >= 1) ? parseInt(val) : 1;
    $('.questionNumber').each(function(index)
    {
        $(this).html(parseInt(index)+val+'.');
    });
}
function totalQuestion()
{
    total = $('.ansRow').length;
    $('#total').html(total);

    return total;
}
function filledAllAnswer()
{
    unanswered = $('.ansRow:not(".answered")').length;
    if (unanswered != 0)
        toastr['warning']('Bạn chưa điền đầy đủ đáp án cho các câu hỏi');
    return unanswered == 0;
}

function answerModal()
{
    $('.icon-hint').on('click', function()
    {
        qIndex = $(this).closest('tr').data('question-order');
        hint = $('#answerModalArea');
        icon = $(this);
        currentValue = (global.answerArray[qIndex]) ? global.answerArray[qIndex] : '';
        hint.val(currentValue);

        $('#answerModal .modal-title').html('Gợi ý trả lời cho câu '+qIndex);

        $('#answerModal').modal()
            .on('hide.bs.modal', function()
            {
                global.answerArray[qIndex] = hint.val();
                icon.removeClass('hinted');
                if (hint.val())
                    icon.addClass('hinted');
            });
    });
}