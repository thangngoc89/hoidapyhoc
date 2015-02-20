/*global angular*/
/* Laravel ng-admin by thangngoc89
 * http://ngadmin.khoanguyen.me
 */
(function () {
    "use strict";

    var app = angular.module('myApp', ['ng-admin']);

    app.directive('createdAt', function () {
        return {
            restrict: 'E',
            template: '<span>{{entry.values.created_at.date}}</span>'
        };
    });

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

    app.config(function (NgAdminConfigurationProvider, Application, Entity, Field, Reference, ReferencedList, ReferenceMany) {
        function truncate(value) {
            if (!value) {
                return '';
            }
            return value.length > 40 ? value.substr(0, 40) + '...' : value;
        }


        var app = new Application('Hỏi Đáp Y Học')
            // remember to change the following to your api link
            .baseApiUrl(location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/api/v2/');

        var user = new Entity('users');
        var role = new Entity('roles');
        var permission = new Entity('permissions');
        var tag = new Entity('tags');
        var testimonial = new Entity('testimonials');

        app
            .addEntity(user)
            .addEntity(role)
            .addEntity(permission)
            .addEntity(testimonial)
            .addEntity(tag);

        /*
         * Permission section
         *
         */
        permission.dashboardView().disable();
        permission.listView()
            .title('All permissions')
            .addField(new Field('id'))
            .addField(new Field('name')
            )
            .addField(new Field('display_name')
                .label('Display Name')
            )
            .listActions(['edit', 'delete']);

        permission.creationView()
            .addField(new Field('name').validation({required: true, minlength: 3}) )
            .addField(new Field('display_name').validation({required: true, minlength: 3}) );

        permission.editionView()
            .addField(new Field('name').validation({required: true, minlength: 3}) )
            .addField(new Field('display_name').validation({required: true, minlength: 3}) );

        /*
         * Role section
         *
         */
        role.dashboardView().disable();

        role.listView()
            .title('All roles')
            .addField(new Field('name').isDetailLink(true))
            .addField(new Field('count').label('# of Users'))
            .listActions(['edit', 'delete']);

        role.creationView()
            .addField(new Field('name').validation({required: true, minlength: 3}) )
            .addField(new ReferenceMany('permissions')
                .targetEntity(permission)
                .targetField(new Field('display_name'))
        );
        role.editionView()
            .addField(new Field('name').validation({required: true, minlength: 3}) )
            .addField(new ReferenceMany('permissions')
                .targetEntity(permission)
                .targetField(new Field('display_name'))
        );

        /*
         * User section
         *
         */


        user.dashboardView()
            .title('Newest User')
            .sortField('id')
            .sortDir('DESC')
            .order(3)
            .limit(10)
            .addField(new Field('id').label('ID'))
            .addField(new Field('username'));

        user.listView()
            .title('All users')
            .addField(new Field('id'))
            .fields([new Field('user').isDetailLink(true)])
            .addField(new Field('email'))
            .addField(new Field('created_at'))
            .addField(new Field('updated_at'))
            .listActions(['edit', 'delete']);

        user.creationView()
            .title('Create User')
            .addField(new Field('username').validation({required: true, minlength: 3}) )
            .addField(new Field('email').type('email').validation({required: true}) )
            .addField(new Field('password').type('password').validation({required: true, minlength: 6}))
            .addField(new Field('password_confirmation').type('password').validation({required: true, minlength: 6}))
            .addField(new Field('confirmed').type('boolean'))
            .addField(new ReferenceMany('roles')
                .targetEntity(role)
                .targetField(new Field('name'))
        );

        user.editionView()
            .title('Edit user "{{ entry.values.username }}"')
            .actions(['list', 'delete'])
            .addField(new Field('id').editable(false))
            .addField(new Field('username'))
            .addField(new Field('email'))
            .addField(new Field('password')
                .type('password')
                .defaultValue(null)
                .validation({minlength: 6}))
            .addField(new Field('password_confirmation')
                .type('password')
                .defaultValue(null)
                .validation({minlength: 6}))
            .addField(new Field('confirmed').type('boolean'))
            .addField(new ReferenceMany('roles')
                .targetEntity(role)
                .targetField(new Field('name'))
        );


        /*
         * Tag section
         *
         */


        tag.menuView()
            .order(3)
            .icon('<span class="glyphicon glyphicon-tags"></span>');

        tag.dashboardView()
            .title('Recent tags')
            .order(3)
            .limit(10)
            .fields([
                new Field('id'),
                new Field('name'),
                new Field('suggest').label('Is suggest ?').type('boolean')
            ]);

        tag.listView()
            .infinitePagination(false) // by default, the list view uses infinite pagination. Set to false to use regulat pagination
            .fields([
                new Field('id').label('ID'),
                new Field('name'),
                new Field('suggest').type('boolean').cssClasses(function(entry) { // add custom CSS classes to inputs and columns
                    if (entry.values.suggest) {
                        return 'bg-success text-center';
                    }
                    return 'bg-warning text-center';
                }),
            ])
            .listActions(['show','delete']);

        tag.showView()
            .fields([
                new Field('name'),
                new Field('suggest').type('boolean')
            ]);
        tag.deletionView()
            .title('Delete Tag {{ entry.values.name }}');

        /*
         * Testimonial section
         *
         */


        testimonial.menuView()
            .order(3)
            .icon('<span class="fa fa-thumbs-up"></span>');

        testimonial.dashboardView().disable();

        testimonial.listView()
            .title('All Testimonials')
            .fields([
                new Field('name'),
                new Field('isHome').type('boolean'),
                new Field('content').type('wysiwyg').map(truncate),
            ])
            .listActions(['show','edit']);

        testimonial.showView()
            .title('Testimonials of {{ entry.values.name }}')
            .fields([
                testimonial.listView().fields(),
                new Field('link'),
                new Field('content').type('wysiwyg'),
                new Field('avatar')
            ]);

        NgAdminConfigurationProvider.configure(app);
    });
}());