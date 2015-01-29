$(function() {
    $.ajaxSetup({
        headers: {
            'X-XSRF-Token': $('meta[name="csrf"]').attr('content')
        }
    });
    $("img").unveil(200);

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
