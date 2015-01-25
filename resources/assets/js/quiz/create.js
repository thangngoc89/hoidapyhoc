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