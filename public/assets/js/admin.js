/*global angular*/
/* Laravel ng-admin by thangngoc89
 * http://ngadmin.khoanguyen.me
 */
(function () {
    "use strict";

    var app = angular.module('myApp', ['ng-admin']);

    app.controller('main', function ($scope, $rootScope, $location) {
        $rootScope.$on('$stateChangeSuccess', function () {
            $scope.displayBanner = $location.$$path === '/dashboard';
        });
    });

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
            console.log(response);
            return data;
        });
        RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
            if (operation == 'getList' && what == 'entityName') {
                params.page = params._page;
                params.limit = params._perPage;
                delete params._page;
                delete params._perPage;
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


        var app = new Application('Hỏi Đáp Y Học') // application main title
            // remember to change the following to your api link
            .baseApiUrl('http://newquiz.dev/api/v2');

        var user = new Entity('users');
        var role = new Entity('roles');
        var permission = new Entity('permissions');

        app
            .addEntity(user)
            .addEntity(role)
            .addEntity(permission);

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
            .addField(new Field('id'))
            .addField(new Field('name').isDetailLink(true))
            .addField(new Field('count').label('# of Users'))
            .addField(new Field().type('template').label('Created Date')
                .template('<created-at></created-at>')
        )
            .listActions(['edit', 'delete']);
        role.creationView()
            .addField(new Field('name').validation({required: true, minlength: 3}) )
            .addField(new ReferenceMany('permissions')
                .targetEntity(permission)
                .targetField(new Field('display_name'))
        )
        role.editionView()
            .addField(new Field('name').validation({required: true, minlength: 3}) )
            .addField(new ReferenceMany('permissions')
                .targetEntity(permission)
                .targetField(new Field('display_name'))
        )

        /*
         * User section
         *
         */


        user.dashboardView()
            .title('New User')
            .order(3)
            .limit(10)
            .addField(new Field('id').label('ID'))
            .addField(new Field('username'));

        user.listView()
            .title('All users')
            .addField(new Field('id'))
            .addField(new Field('username'))
            .addField(new Field('email'))
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
        )

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

        NgAdminConfigurationProvider.configure(app);
    });
}());