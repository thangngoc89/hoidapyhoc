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
    $("img").unveil(200);

    $("#q").selectize({
        valueField: 'url',
        labelField: 'name',
        searchField: ['name'],
        maxOptions: 10,
        options: [],
        create: false,
        render: {
            option: function(item, escape) {
                return '<div>' +escape(item.name)+'</div>';
            }
        },
        optgroups: [
            {value: 'tag', label: 'Tag'},
            {value: 'exam', label: 'Đề thi'},
            {value: 'video', label: 'Video'}
        ],
        optgroupField: 'group',
        optgroupOrder: ['exam','tag'],
        load: function(query, callback) {
            if (!query.length) return callback();
            $.ajax({
                url: '/api/v2/search',
                type: 'GET',
                dataType: 'json',
                data: {
                    q: query
                },
                error: function() {
                    callback();
                },
                success: function(res) {
                    callback(res.data);
                }
            });
        },
        onChange: function(){
            window.location = this.items[0];
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
};




function sticky()
{
    width=parseInt($(window).width());

    if(width>767) {
        $("#quiz-sidebar, #mainRow").stick_in_parent();
    }
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

function validationError(response)
{
    $.each(response, function(key, object) {
        object.forEach(function(message)
        {
            toastr['warning'](message);
        });
    });
}

function preventClosing()
{
    window.onbeforeunload = function (e) {
        e = e || window.event;
        if(global.preventClose){
            // For IE and Firefox prior to version 4
            if (e) {
                e.returnValue = 'Bạn có chắc chắn muốn thoát ? ';
            }
            // For Safari
            return 'Bạn có chắc chắn muốn thoát ? ';
        }
    };
}

function pushState(hash)
{
    if(history.pushState) {
        history.pushState(null, null, hash);
    }
    else {
        location.hash = hash;
    }
}
function quizDoInt()
{
    handleTabs();
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

        global.preventClose = true;
        preventClosing();

    });
}
function setCounter(){
    $.ajax({
        type: "POST",
        dataType: "json",
        url: '/api/v2/exams/'+testId+'/start',
        error: function (data) {
            toastr.error(':( Đã có lỗi xảy ra. Mong các bạn hãy thử lại');
            data = $.parseJSON(data.responseText);
            validationError(data);
            console.log(data);
        },
        success: function(data){
            userHistoryId = data.user_history_id;
            counter = setInterval(timer, 1000);
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
            $("#btnSubmit").button('reset');
        },
        success: function(data){
            global.preventClose = false;

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

function handleTabs()
{
    // Javascript to enable link to tab
    var hash = document.location.hash;
    if (hash) {
        $('.lessons-nav__primary a[href='+hash+']').tab('show');
    }

// Change hash for page-reload
    $('.lessons-nav__primary a').on('shown.bs.tab', function (e) {

        pushState(e.target.hash);

        if (e.target.hash == '#leaderBoard')
            showLeaderBoard();
    });
}

function showLeaderBoard()
{
    ele = $('div#leaderBoard');

    if (!ele.html().trim())
    {
        getRenderedLeaderBoard('/api/v2/exams/'+ testId +'/leaderboard');
    }
}

function getRenderedLeaderBoard(url)
{
    $.ajax({
        type: "GET",
        url: url,
        data: {
            'render': true
        },
        error: function(data){
            console.log(data.responseText);
            toastr.error('Không thể tải bảng điểm. Vui lòng thử lại sau');
        },
        success: function(data){
            ele.html(data);
            ajaxLoadPage();
        }
    });

}

function ajaxLoadPage()
{
    $pagination = $('#leaderBoard > .forum-pagination a');

    $pagination.unbind();
    $pagination.on('click', function(event){
        event.preventDefault();
        getRenderedLeaderBoard($(this).attr('href'));
    });
}
(function ( $ ) {
    $.fn.quiz = function() {
        data = global.data;

        switch(data.type)
        {
            case 'edit': initEdit(); break;
            case 'create': initCreate(); break;
        }
    };

    var $ele = {
        name: $('#input-name'),
        content: $('#content'),
        description : $('#input-description'),
        begin : $('#begin'),
        tag : $('#select-tags'),
        tabContent : $('#tab-content a'),
        adjustTotal : $('#adjustTotal'),
        answerTable : $("#answer"),
        btnCreateSubmit : $('#btnCreateSubmit')
    };

    var quiz= {
        postUrl : '/api/v2/exams',
        postAjaxMethod : 'POST',
        answerArray : {},
        preventClose: true
    };

    function initCreate()
    {
        fixTemplate();
        setupQuestion();
        buttonListener();
        iconListener();

        $('#frmTest').on('submit', function(event)
        {
            event.preventDefault();
            post();
        });
        sticky();
        editor();
        uploader();
        
        preventClosing();

    }

    function initEdit()
    {
        test = global.data.test;

        $ele.name.val(test.name);
        $ele.description.val(test.description);
        $ele.content.html(test.content);
        console.log($ele.begin.val());
        $ele.begin.val(parseInt(test.beginFrom));
        console.log($ele.begin.val());


        if(test.file)
        {
            $ele.tabContent.last().tab('show');
            pdfFile = {'link' : test.file.link, 'id' : test.file.id };
            embedPdf(pdfFile);
        }

        if (test.tags)
            $ele.tag.val(test.tags.join());
        $ele.adjustTotal.hide();

        quiz.postAjaxMethod = 'PUT';
        quiz.postUrl = '/api/v2/exams/'+test.id;

        initCreate();
    }


    function post()
    {
        data = validator();
        if (!data) return;

        $.ajax({
            type: quiz.postAjaxMethod,
            dataType: "json",
            url: quiz.postUrl,
            data: data,
            beforeSend: function(){
                $ele.btnCreateSubmit.button('loading');
            },
            error: function (data) {
                $ele.btnCreateSubmit.button('reset');
                toastr.error('Có lỗi xảy ra. Vui lòng kiểm tra kĩ và thử lại');
                data = $.parseJSON(data.responseText);
                validationError(data);
                debug(data);
            },
            success: function (data) {
                successPostMessage(data);
            }
        });
    }
    function successPostMessage(data)
    {
        swal({
                title: "Đã gửi đề thi thành công",
                text: "Làm gì tiếp theo?",
                type: "success",
                showCancelButton: true,
                confirmButtonClass: "btn-info",
                confirmButtonText: "Xem đề thi",
                cancelButtonText: "Chỉnh sửa",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function (isConfirm) {
                quiz.preventClose = false;
                if (isConfirm) {
                    location.href = data.url;
                } else {
                    location.href = data.editUrl;
                }
        });
    }

    function validator()
    {
        if (!filledAllAnswer()) return false;
        name = $('#input-name').val();
        description =  $('#input-description').val();
        content =  $("#content").editable("getHTML");
        begin = $('#begin').val();
        begin = (parseInt(begin) >= 1) ? parseInt(begin) : 1;

        tags = $('#select-tags').val();
        time = $('#select-time').val();
        is_file = 0;
        file_id = null;

        if (!name || name.length <6)
        {
            toastr['warning']('Tên đề thi có độ dài tối thiểu là 6');
            return false;
        }

        if (description && description.length <6)
        {
            toastr['warning']('Mô tả có độ dài tối thiểu là 6');
            return false;
        }
        // Detect upload tab to create a pdf-based exam
        pdf_upload = $('a[role="tab"][aria-expanded="true"]').attr('href');
        pdf_upload = (pdf_upload == '#upload');
        if(pdf_upload)
        {
            if (!global.pdf_file_id)
            {
                toastr['warning']('Bạn chưa upload file pdf');
                return false;
            }
            is_file = 1;
            file_id = global.pdf_file_id;
        }

        console.log(!content && !pdf_upload);

        if (!content && !pdf_upload)
        {
            toastr['warning']('Bạn chưa nhập nội dung đề thi');
            return false;
        }

        // Return serialize and validated data for sending
        return {
            name: name,
            description: description,
            content: content,
            begin: begin,
            tags: tags,
            thoigian: time,
            is_file: is_file,
            file_id: file_id,
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
                'answer' : givenAnswer.toUpperCase(),
                'content' : (quiz.answerArray[index+1]) ? quiz.answerArray[index+1] : '',
            };
            questions.push(question);
        });
        return questions;
    }

    function iconListener()
    {
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

    function setupQuestion()
    {
        if (global.data.test)
            addQuestion(global.data.test.questionsCount,global.data.test.questions);
        else
            addQuestion(5,false);
    }

    function addQuestion(value,data)
    {
        for(i=1; i<=value; i++)
        {
            qIndex = $('.ansRow:last').data('question-order');
            qIndex = (qIndex) ? qIndex : 0;

            dataNode = (data) ? data[i-1] : false;
            addNewRow(parseInt(qIndex)+1,dataNode);
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
            $('tr[data-question-order="'+i+'"]').remove();
        }
        totalQuestion();
    }

    function addNewRow(index, data)
    {
        selectedAnswer = false;
        content = false;
        answerd = '';
        if (data)
        {
            selectedAnswer = data.answer.toLowerCase();
            content = data.content;
            answerd = ' answered';
            if(content)
                quiz.answerArray[index] = content;
        }
        row = '<tr class="ansRow'+answerd+'" data-question-order="'+index+'">' +
        '<td align="center" class="questionNumber">'+index+'.</td>';

        ['a','b','c','d','e'].forEach(function(option)
            {
                opchoice = (selectedAnswer == option) ? ' op-choice' : '';
                value = (selectedAnswer == option) ? 1 : 0;
                hinted = (content) ? ' hinted' : '';
                row  += '<td><a id="a_'+index+'_'+option+'" rel="1" ' +
                'class="icontest-option op-'+option+opchoice+'"' +
                'href="#"">' +option+ '</a>'+
                '<input type="hidden" id="answer_'+index+'_'+option+'" name="answer_'+index+'_'+option+'" value="'+value+'">'+
                '</td>';
            }
        );
        row += '<td><a href="javscript::void(0)" class="iconHint"><i class="zn-icon icon-hint'+hinted+'"></i></a></td></tr>';

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
        $('.icon-hint').unbind('click');
        $('.icon-hint')
            .on('click', function()
            {
                qIndex = $(this).closest('tr').data('question-order');

                hint = $('#answerModalArea');
                icon = $(this);
                currentValue = (quiz.answerArray[qIndex]) ? quiz.answerArray[qIndex] : '';
                hint.val(currentValue);

                questionNumber = parseInt(qIndex) + parseInt($ele.begin.val()) -1;
                $('#answerModal .modal-title').html('Gợi ý trả lời cho câu '+ questionNumber);

                quiz.preventClose = false;

                $('#answerModal').modal()
                    .on('hide.bs.modal', function()
                    {
                        quiz.preventClose = true;
                        quiz.answerArray[qIndex] = hint.val();
                        icon.removeClass('hinted');
                        if (hint.val())
                            icon.addClass('hinted');
                    });
            });
    }

    function uploader()
    {
        Dropzone.autoDiscover = false;

        $("div#images-uploader").dropzone({
            url: '/api/v2/files',
            paramName: "file",
            headers: {'X-XSRF-Token': $('meta[name="csrf"]').attr('content')},
            maxFilesize: 3, // MB
            parallelUploads: 1,
            acceptedFiles: 'image/*',
            dictDefaultMessage: 'Kéo và thả ảnh vào đây để upload',
            dictInvalidFileType: 'Định dạng file không cho phép',
            init: function() {
                this.on("success", function(file,response) {
                    imgHTML = "<img src='"+response.link+"' alt='"+response.original_filename+"'/>";

                    $ele.content.editable("insertHTML", imgHTML, true);
                });
                this.on("error", function(file,response){
                    validationError(response);
                });
            }
        });
        // PDF uploader init
        $("div#pdf-uploader").dropzone({
            url: '/api/v2/files',
            paramName: "file",
            headers: {'X-XSRF-Token': $('meta[name="csrf"]').attr('content')},
            maxFilesize: 10,
            parallelUploads: 1,
            acceptedFiles: 'application/pdf',
            dictDefaultMessage: 'Kéo và thả file PDF vào đây<br>Kích thước tối đa 10MB',
            dictInvalidFileType: 'Định dạng file không cho phép',
            dictResponseError: 'abc',
            init: function() {
                this.on("success", function(file,response) {
                    embedPdf(response);
                });
                this.on("error", function(file,response){
                    validationError(response);
                });
            }
        });

        $('div#close-uploader').on('click', function(){
           $(this).parent().slideUp();
        });

        $('a#toggle-uploader').on('click', function(event){
           event.preventDefault();
            $('div#images-uploader').slideToggle();
        });
    }

    function embedPdf(data)
    {
        $('#pdf').html('<iframe width="100%" height="750px" src="http://hoidapyhoc.com/assets/pdfjs/web/viewer.html?file='+data.link+'"></iframe>');
        global.pdf_file_id = data.id;
    }

    function editor()
    {
        $ele.content.editable({
            inlineMode: true,
            alwaysVisible: true,
            pasteImage: true,
            pastedImagesUploadURL: "/api/v2/files/paste",
            maxImageSize: 1024 * 1024 * 3,
            noFollow: true,
            imageUploadURL: '/api/v2/files',
            defaultImageWidth: 0,
            imageUploadParams: {
                type: "json"
            },
            headers: {
                'X-XSRF-Token' : $('meta[name="csrf"]').attr('content')
            }
        });
        $('a[href*="froala.com"]').closest('div').hide();

        $("#select-tags").selectize({
            plugins: ['remove_button'],
            valueField: 'name',
            labelField: 'name',
            searchField: 'name',
            persist: false,
            create: true,
            maxItems: 5,
            render: {
                option: function(item, escape) {

                    return '<div><span class="post-tag">' + escape(item.name) + '</span>'
                    + '<span class="item-multiplier"><span class="item-multiplier-x">×</span>&nbsp;' +
                    '<span class="item-multiplier-count">' + item.count +
                    '</span></span></div>';
                }
            },
            load: function(query, callback) {
                if (!query.length) return callback();
                $.ajax({
                    url: '/api/v2/tags/search/' + encodeURIComponent(query),
                    type: 'GET',
                    error: function() {
                        callback();
                    },
                    success: function(data) {
                        callback(data.data);
                    }
                });
            }
        });
    }

    function preventClosing()
    {
        window.onbeforeunload = function (e) {
            e = e || window.event;
            if(quiz.preventClose){
                // For IE and Firefox prior to version 4
                if (e) {
                    e.returnValue = 'Bạn có chắc chắn muốn thoát ? ';
                }
                // For Safari
                return 'Bạn có chắc chắn muốn thoát ? ';
            }
        };
    }

    function fixTemplate()
    {
        // Fixing sidebar on create/edit mode
        width=parseInt($(window).width());

        if(width<=767) {
            $('.quiz-sidebar-section').css('max-height', '100%').toggle();
        }
    }

    function debug(data)
    {
        window.console.log(data);
    }

}( jQuery ));