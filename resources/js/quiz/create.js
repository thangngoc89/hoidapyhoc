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
        time : $('#select-time'),
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
        editor();
        uploader();
        
        preventClosing();
        sticky();
    }

    function initEdit()
    {
        test = global.data.test;

        $ele.name.val(test.name);
        $ele.description.val(test.description);
        $ele.content.html(test.content);

        $ele.begin.val(parseInt(test.begin));
        $ele.time.val(parseInt(test.thoigian));

        if(test.file)
        {
            $('a[href="#upload"]').tab('show');
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
        {
            questionsCount = global.data.test.questions.length;
            addQuestion(questionsCount,global.data.test.questions);
        }
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
            headers: {'X-CSRF-Token': $('meta[name="csrf"]').attr('content')},
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
            headers: {'X-CSRF-Token': $('meta[name="csrf"]').attr('content')},
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
                'X-CSRF-Token' : $('meta[name="csrf"]').attr('content')
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
            //render: {
            //    option: function(item, escape) {
            //
            //        return '<div><span class="post-tag">' + escape(item.name) + '</span>'
            //        + '<span class="item-multiplier"><span class="item-multiplier-x">×</span>&nbsp;' +
            //        '<span class="item-multiplier-count">' + item.count +
            //        '</span></span></div>';
            //    }
            //},
            load: function(query, callback) {
                if (!query.length) return callback();
                $.ajax({
                    url: '/api/v2/tags/autocomplete/' + encodeURIComponent(query),
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