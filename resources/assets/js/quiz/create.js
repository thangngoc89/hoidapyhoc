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
    if (filledAllAnswer())
    {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: '/api/v2/tests',
            data: {
                'name': editorName.serialize().name.value,
                'description': editorDescription.serialize().description.value,
                'content': editorContent.serialize().content.value,
            },
            error: function(data){
                console.log(data.responseText);
                toastr.error('Có lỗi xảy ra. Vui lòng kiểm tra kĩ và thử lại');
            },
            success: function(data){
                console.log(data);
            }
        });
    }
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