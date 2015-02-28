function sticky()
{
    width=parseInt($(window).width());

    if(width>767) {
        $('#quiz-sidebar').stickit({
            scope: StickScope.Parent,
            className: 'stick',
            top: 0,
            extraHeight: 14
        });

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