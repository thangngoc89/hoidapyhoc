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
        permission.menuView()
            .icon('<span class="fa fa-key"></span>');

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
        role.menuView()
            .icon('<span class="fa fa-user-secret"></span>');

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
        user.menuView()
            .icon('<span class="fa fa-users"></span>');

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
        video.menuView()
            .icon('<span class="fa fa-youtube"></span>');

        video.dashboardView()
            .title('New Users')
            .sortField('id')
            .sortDir('DESC')
            .order(1)
            .limit(10)
            .fields([
                nga.field('id').editable(false),
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
            .listActions(['show', 'edit', 'delete']);

        video.editionView()
            .title('Edit video "{{ entry.values.title }}"')
            .fields([
                video.listView().fields(),
                nga.field('description'),
                nga.field('link'),
                nga.field('source'),
                nga.field('thumb'),
                nga.field('duration'),
            ])
            .actions(['list']);

        video.showView()
            .fields([
                video.editionView().fields(),
                nga.field('user_id','reference')
                    .label('User')
                    .targetEntity(user)
                    .targetField(nga.field('username')),
                nga.field('views')
            ]);

        /*
        * Tag section
        *
        */


        tag.menuView()
            .icon('<span class="glyphicon glyphicon-tags"></span>');

        tag.dashboardView()
            .title('Recent tags')
            .order(3)
            .limit(10)
            .fields([
                nga.field('id'),
                nga.field('name'),
                nga.field('suggest','boolean')
                    .label('Is suggest ?')
            ]);

        tag.listView()
            .fields([
                nga.field('name'),
                nga.field('suggest','boolean')
                    .cssClasses(function(entry) {
                    if (entry.values.suggest) {
                        return 'bg-success text-center';
                    }
                    return 'bg-warning text-center';
                }),
            ])
            .listActions(['edit','delete']);

        tag.editionView()
            .fields([
                nga.field('name'),
                nga.field('description'),
                nga.field('suggest','boolean')

            ]);
        tag.deletionView()
            .title('Delete Tag "{{ entry.values.name }}"');

        /*
        * Testimonial section
        *
        */


        //testimonial.menuView()
        //    .order(3)
        //    .icon('<span class="fa fa-thumbs-up"></span>');
        //
        //testimonial.dashboardView().disable();
        //
        //testimonial.listView()
        //    .title('All Testimonials')
        //    .fields([
        //        nga.field('name'),
        //        nga.field('isHome').type('boolean'),
        //        nga.field('content').type('wysiwyg').map(truncate),
        //    ])
        //    .listActions(['show','edit']);
        //
        //testimonial.showView()
        //    .title('Testimonials of {{ entry.values.name }}')
        //    .fields([
        //        testimonial.listView().fields(),
        //        nga.field('link'),
        //        nga.field('content').type('wysiwyg'),
        //        nga.field('avatar')
        //    ]);

        nga.configure(app);
    });
}());