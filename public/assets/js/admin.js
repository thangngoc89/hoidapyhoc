/*global angular*/
/* Laravel ng-admin by thangngoc89
 * http://ngadmin.khoanguyen.me
 */
(function () {
    "use strict";

    var app = angular.module('myApp', ['ng-admin']);

    /* Pass csrf token to X-CSRF-TOKEN header on every request */
    app.config(['$httpProvider',function($httpProvider){
        $httpProvider.defaults.headers.common['X-XSRF-TOKEN'] = document.getElementsByTagName('csrf')[0].getAttribute("content")
    }]);

    app.config(function(RestangularProvider) {
        RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response) {
            if (operation == "getList") {
                response.totalCount = data.meta.pagination.total;
                data = data.data;
            }

            if (operation == 'get')
            {
                data = data.data;
            }

            //console.log(response);
            return data;
        });
        RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
            if (operation == 'getList') {

                params.page = params._page;
                delete params._page;
            }
            return { params: params };
        });
    });

    app.config(function (NgAdminConfigurationProvider) {

        function truncate(value, limit) {
            if (!limit)
                limit = 40;

            if (!value) {
                return '';
            }
            return value.length > limit ? value.substr(0, limit) + '...' : value;
        }
        var nga = NgAdminConfigurationProvider;

        var app = nga.application('Hỏi Đáp Y Học')
            .baseApiUrl(location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/api/v2/');

        var permission = nga.entity('permissions');
        var role = nga.entity('roles');
        var user = nga.entity('users');
        var video = nga.entity('videos');
        var tag = nga.entity('tags');

        app.addEntity(permission);
        app.addEntity(role);
        app.addEntity(user);
        app.addEntity(video);
        app.addEntity(tag);

        /*
         * Permission section
         *
         */
        permission.dashboardView().disable();
        permission.listView()
            .title('All permissions')
            .description('Lists of all available permissions')
            .fields([
                nga.field('id'),
                nga.field('name'),
                nga.field('display_name'),
            ])
            .listActions(['edit', 'delete']);

        permission.creationView()
            .fields([
                nga.field('name')
                    .attributes({ placeholder: 'Fill in the permission name' })
                    .validation({ required: true, minlength: 3, maxlength: 100 }),
                nga.field('display_name')
                    .attributes({ placeholder: 'Fill in the permission name' })
                    .validation({ required: true, minlength: 3, maxlength: 100 }),
            ]);

        permission.editionView()
            .fields([
                permission.creationView().fields()
            ]);

        /*
         * Role section
         *
         */
        role.dashboardView().disable();

        role.listView()
            .title('All roles')
            .description('Lists of all available roles')
            .fields([
                nga.field('name')
                    .isDetailLink(true),
                nga.field('count').label('# of Users')
            ])
            .listActions(['edit', 'delete']);

        role.creationView()
            .fields([
                nga.field('name')
                    .validation({required: true, minlength: 3}),
                nga.field('permissions', 'reference_many')
                .targetEntity(permission)
                .targetField(nga.field('display_name')),
            ]);

        role.editionView()
            .fields([
                role.creationView().fields(),
            ]);

        /*
        * User section
        *
        */


        user.dashboardView()
            .title('New Users')
            .sortField('id')
            .sortDir('DESC')
            .order(1)
            .limit(10)
            .fields([
                nga.field('id'),
                nga.field('username').isDetailLink(true)
            ]);

        user.listView()
            .title('All users')
            .fields([
                user.dashboardView().fields(),
                nga.field('email','email'),
                nga.field('created_at', 'date').editable(false)
            ])
            .listActions(['show', 'edit']);

        user.editionView()
            .title('Edit user "{{ entry.values.username }}"')
            .actions(['list'])
            .fields([
                user.listView().fields(),
                nga.field('roles','reference_many')
                    .targetEntity(role)
                    .targetField(nga.field('name'))
            ]);

        user.showView()
            .title('{{ entry.values.username }}\'s infomation')
            .fields([
               user.editionView().fields()
            ]);

        /*
         * Videos section
         *
         */

        video.dashboardView()
            .title('New Users')
            .sortField('id')
            .sortDir('DESC')
            .order(1)
            .limit(10)
            .fields([
                nga.field('id'),
                nga.field('title').isDetailLink(true)
            ]);

        video.listView()
            .title('All videos')
            .fields([
                video.dashboardView().fields(),
                nga.field('tags', 'reference_many')
                    .targetEntity(tag)
                    .targetField(nga.field('name'))
                    .singleApiCall(function (tagIds) {
                        return { 'id': tagIds };
                    }),
                nga.field('created_at', 'date').editable(false)
            ])
            .listActions(['show', 'edit']);

        video.editionView()
            .title('Edit video "{{ entry.values.username }}"')
            .fields([
                nga.field('title'),
                nga.field('user_id','reference')
                    .label('User')
                    .targetEntity(user)
                    .targetField(nga.field('username')),
                nga.field('source'),
                nga.field('thumb'),
                nga.field('duration')
            ])
            .actions(['list']);

        video.showView()
            .fields([
                video.editionView().fields(),
                nga.field('views')
            ]);
        //
        ///*
        // * Tag section
        // *
        // */
        //
        //
        //tag.menuView()
        //    .order(3)
        //    .icon('<span class="glyphicon glyphicon-tags"></span>');
        //
        //tag.dashboardView()
        //    .title('Recent tags')
        //    .order(3)
        //    .limit(10)
        //    .fields([
        //        new Field('id'),
        //        new Field('name'),
        //        new Field('suggest').label('Is suggest ?').type('boolean')
        //    ]);
        //
        //tag.listView()
        //    .infinitePagination(false) // by default, the list view uses infinite pagination. Set to false to use regulat pagination
        //    .fields([
        //        new Field('id').label('ID'),
        //        new Field('name'),
        //        new Field('suggest').type('boolean').cssClasses(function(entry) { // add custom CSS classes to inputs and columns
        //            if (entry.values.suggest) {
        //                return 'bg-success text-center';
        //            }
        //            return 'bg-warning text-center';
        //        }),
        //    ])
        //    .listActions(['show','delete']);
        //
        //tag.showView()
        //    .fields([
        //        new Field('name'),
        //        new Field('suggest').type('boolean')
        //    ]);
        //tag.deletionView()
        //    .title('Delete Tag {{ entry.values.name }}');
        //
        ///*
        // * Testimonial section
        // *
        // */
        //
        //
        //testimonial.menuView()
        //    .order(3)
        //    .icon('<span class="fa fa-thumbs-up"></span>');
        //
        //testimonial.dashboardView().disable();
        //
        //testimonial.listView()
        //    .title('All Testimonials')
        //    .fields([
        //        new Field('name'),
        //        new Field('isHome').type('boolean'),
        //        new Field('content').type('wysiwyg').map(truncate),
        //    ])
        //    .listActions(['show','edit']);
        //
        //testimonial.showView()
        //    .title('Testimonials of {{ entry.values.name }}')
        //    .fields([
        //        testimonial.listView().fields(),
        //        new Field('link'),
        //        new Field('content').type('wysiwyg'),
        //        new Field('avatar')
        //    ]);

        nga.configure(app);
    });
}());