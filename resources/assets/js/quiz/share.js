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

function preventClosing()
{
    if (global.preventClose)
    {
        window.onbeforeunload = function (e) {
            e = e || window.event;
            if(!close_page){
                // For IE and Firefox prior to version 4
                if (e) {
                    e.returnValue = 'Bạn có chắc chắn muốn thoát ? ';
                }
                // For Safari
                return 'Bạn có chắc chắn muốn thoát ? ';
            }
        };
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