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
        postUrl : '/api/v2/tests',
        postAjaxMethod : 'POST',
        answerArray : {},
        preventClose: true
    };

    function initCreate()
    {
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
        $ele.begin.html(test.begin);

        if(test.file)
        {
            $ele.tabContent.last().tab('show');
            embedPdf(test.file);
        }

        if (test.tags)
            $ele.tag.val(test.tags.join());
        $ele.adjustTotal.hide();

        quiz.postAjaxMethod = 'PUT';
        quiz.postUrl = '/api/v2/tests/'+test.id;

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
            beforesend: function(){
                $ele.btnCreateSubmit.button('loading');
            },
            error: function (data) {
                toastr.error('Có lỗi xảy ra. Vui lòng kiểm tra kĩ và thử lại');
                data = $.parseJSON(data.responseText);
                validationError(data);
                debug(data);
                $ele.btnCreateSubmit.button('reset');
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
        if(pdf_upload == '#upload')
        {
            if (!global.pdf_file_id)
            {
                toastr['warning']('Bạn chưa upload file pdf');
                return false;
            }
            is_file = 1;
            file_id = global.pdf_file_id;
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
                'right_answer' : givenAnswer.toUpperCase(),
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
        answerd = ''
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
        $("#uploadarea").uploadFile({
            url:"/api/v2/files",
            maxFileSize: 10*1024*1024,   //Bytes
            allowedTypes: 'pdf',
            showStatusAfterSuccess: false,
            formData: { type: 'json' },
            dragDropStr: "<span><b>Kéo và thả file vào đây để upload</b></span>",
            sizeErrorStr: "quá lớn. Dung lượng file tối đa là ",
            uploadErrorStr: "Đã có lỗi xảy ra trong quá trình upload",
            uploadButtonClass:"btn btn-info",
            onSuccess:function(files,data,xhr)
            {
                embedPdf(data);
            }
        });
    }

    function embedPdf(data)
    {
        $('#pdf').html('<iframe width="100%" height="750px" src="http://hoidapyhoc.com/assets/pdfjs/web/viewer.html?file='+data.link+'"></iframe>');
        global.pdf_file_id = data.id;
    }

    function editor()
    {
<<<<<<< HEAD
        $('#content').editable({
            inlineMode: true,
            alwaysVisible: true,
            pasteImage: true,
            pastedImagesUploadURL: "/api/v2/files/paste",
            maxImageSize: 1024 * 1024 * 3,
            noFollow: true,
            imageUploadURL: '/api/v2/files',
            imageUploadParams: {
                type: "json"
            },
            headers: {
                'X-XSRF-Token' : $('meta[name="csrf"]').attr('content')
            }

        });
        //$('a[href*="froala.com"]').closest('div').hide();
=======
        var editorContent = $('#content').editable({
            inlineMode: true,
            alwaysVisible: true
        });
        $('a[href*="froala.com"]').closest('div').hide();
>>>>>>> f13392376d5b4aaa4f0f69e2d2b041af79bceb8b
        $("#select-tags").selectize({
            plugins: ['remove_button'],
            options: global.data.tags,
            valueField: 'text',
            labelField: 'text',
            create: function(input) {
                return {
                    value: input,
                    text: input
                }
            },
            maxItems: 3,
            render: {
                option: function(item, escape) {
                    var name = item.text;
                    var count = item.count;

                    return '<div><span class="post-tag">' + name + '</span>'
                    + '<span class="item-multiplier"><span class="item-multiplier-x">×</span>&nbsp;' +
                    '<span class="item-multiplier-count">' + count +
                    '</span></span></div>';
                }
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

    function debug(data)
    {
        window.console.log(data);
    }

}( jQuery ));