function quizCreateInt()
{
    //sticky();

    // Init Test Icon
    choiceDo();
    answerModel();

    changeTotalQuestion();
    $('#frmTest').on('submit', function(event)
    {
        event.preventDefault();
        post();
    });
}

function post()
{
    console.log(filledAllAnswer());

    if (filledAllAnswer())
    {

    }
}

function changeTotalQuestion()
{
    element = $('#questionCount');
    before = element.val();

    element.on('focusout', function()
        {
            after = element.val();
            adjustQuestionTotal(after);
            if (checkQuestionTotal() && (after < before))
            {
                swal({
                        title: "Tổng số câu hỏi bạn vừa nhập vào nhỏ hơn ban đầu",
                        text: "Bạn vẫn muốn thay đổi chứ?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn-warning",
                        confirmButtonText: "Có chứ!",
                        cancelButtonText: "Không",
                    },
                    function(isConfirm) {
                        if (isConfirm) {
                            adjustQuestionTotal(after);
                        }
                    });
            }
        })
        .on('keyup', function()
        {
            checkQuestionTotal();
        })


}

function adjustQuestionTotal(num)
{
    console.log(num);

    for(i=1; i<= num; i++)
    {
        qIndex = $('.ansRow:last').data('question-order');
        addNewLine(qIndex+1);
    }
    choiceDo();
}
function addNewLine(index)
{
    console.log('added');
    row = '<tr class="ansRow" data-question-order="{{$i}}">' +
    '<td align="center" class="questionNumber">'+index+'.</td>';

    ['a','b','c','d','e'].forEach(function(option)
        {
            row  += '<td><a id="a_'+index+'_a" rel="1" class="icontest-option op-a" href="#"">a</a>'+
            '<input type="hidden" id="answer_'+index+'_a" name="answer_'+index+'_1" value="0">'+
            '</td>';
        }
    );
    row += '<td><a href="javscript::void(0)"><i class="zn-icon icon-hint"></i></a></td></tr>';

    $('#answer>tbody').append(row);
}

function filledAllAnswer()
{
    unanswered = $('.ansRow:not(".answered")').length;
    return unanswered == 0;
}

function answerModel()
{
    $('.icon-hint').on('click', function()
    {
        qIndex = $(this).closest('tr').data('question-order');
        hint = $('#answerModalArea');

        hint.val('');
        $('#answerModal .modal-title').html('Gợi ý trả lời cho câu '+qIndex);

        $('#answerModal').modal()
            .on('hide.bs.modal', function()
            {
                answerArray[qIndex] = hint.val();
            });
    });
}

function checkQuestionTotal()
{
    val = $('#questionCount').val();
    //console.log(parseInt(val));
    if (!(parseInt(val) >= 1))
    {
        toastr['warning']('Tổng số câu hỏi không được nhỏ hơn 1');
        return false;
    } else
        return true;
}