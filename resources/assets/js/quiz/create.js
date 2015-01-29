(function ( $ ) {

    $.fn.quiz = function( options ) {

        var op = $.extend({
            // These are the defaults.
            color: "#556b2f",
            backgroundColor: "white"
        }, options );
        var data;

        buttonListener();
        iconListener();
        uploader();

        $('#frmTest').validator('validate');
        $('#frmTest').on('submit', function(event)
        {
            event.preventDefault();
            post();
        });
        sticky();
        editor();
        global.answerArray = [];
        preventClosing();
        global.preventClose = true;
    };

    function post()
    {
        data = validator();
        if (data) {
            $.ajax({
                type: "POST",
                dataType: "json",
                url: '/api/v2/tests',
                data: data,
                error: function (data) {
                    data = $.parseJSON(data.responseText);
                    validationError(data);
                    console.log(data);
                    toastr.error('Có lỗi xảy ra. Vui lòng kiểm tra kĩ và thử lại');
                },
                success: function (data) {
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
                            global.preventClose = false;
                            if (isConfirm) {
                                location.href = data.url;
                            } else {
                                location.href = data.editUrl;
                            }
                        });
                }
            });
        }
    }

    function validator()
    {
        if (!filledAllAnswer()) return false;
        name = $('#input-name').val();
        description =  $('#input-description').val();
        content =  editorContent.serialize().content.value;
        begin = $('#begin').val();
        begin = (parseInt(begin) >= 1) ? parseInt(begin) : 1;

        tags = $('#select-tags').val();
        time = $('#select-time').val();
        is_file = 0;
        file_id = null;

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
                'content' : (global.answerArray[index+1]) ? global.answerArray[index+1] : '',
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
        $('.icon-hint').unbind('click');
        $('.icon-hint')
            .on('click', function()
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
                $('#pdf').html('<iframe width="100%" height="750px" src="http://hoidapyhoc.com/assets/pdfjs/web/viewer.html?file='+data.url+'"></iframe>');
                global.pdf_file_id = data.id;
            }
        });
    }

    function editor()
    {
        editorContent = new MediumEditor('#content', {
            anchorInputPlaceholder: 'Nhập một liên kết mới',
            buttonLabels: 'fontawesome',
            firstHeader: 'h1',
            secondHeader: 'h2',
            targetBlank: true,
            cleanPastedHTML: true,
        });
        $('#content').mediumInsert({
            editor: editorContent,
            addons: {
                images: {
                    imagesUploadScript: '/api/v2/files',
                    imagesDeleteScript: '/api/v2/files'
                }
            }
        });

        $("#select-tags").select2({
            tags: true,
            data: global.data.tags,
            maximumSelectionLength: 3,
            templateResult: function(result) {
                if (result.count === undefined) {
                    return result.text;
                }

                return '<span class="post-tag">' + result.text + '</span>'
                + '<span class="item-multiplier"><span class="item-multiplier-x">×</span>&nbsp;' +
                '<span class="item-multiplier-count">' + result.count
                '</span></span>';
            }
        });
    }

}( jQuery ));