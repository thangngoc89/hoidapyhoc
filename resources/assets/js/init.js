$(function() {
    $.ajaxSetup({
        headers: {
            'X-XSRF-Token': $('meta[name="csrf"]').attr('content')
        }
    });
    $("img").unveil(200);

    $("#q").selectize({
        valueField: 'url',
        labelField: 'name',
        searchField: ['name'],
        maxOptions: 10,
        options: [],
        create: false,
        render: {
            option: function(item, escape) {
                return '<div>' +escape(item.name)+'</div>';
            }
        },
        optgroups: [
            {value: 'tag', label: 'Tag'},
            {value: 'exam', label: 'Đề thi'},
            {value: 'video', label: 'Video'}
        ],
        optgroupField: 'group',
        optgroupOrder: ['exam','tag'],
        load: function(query, callback) {
            if (!query.length) return callback();
            $.ajax({
                url: '/api/v2/search',
                type: 'GET',
                dataType: 'json',
                data: {
                    q: query
                },
                error: function() {
                    callback();
                },
                success: function(res) {
                    callback(res.data);
                }
            });
        },
        onChange: function(){
            window.location = this.items[0];
        }
    });
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



