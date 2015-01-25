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