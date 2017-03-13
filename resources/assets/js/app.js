var app = angular.module('app',['ngRoute','angular-oauth2','app.controllers','app.services']);

angular.module('app.controllers',['ngMessages','angular-oauth2']);
angular.module('app.services',['ngResource']);
app.provider('appConfig', function(){
    var config = {
        baseUrl: 'http://localhost:8000'
    }

    return {
        config : config,
        $get : function(){
            return config;
        }
    }
});

app.config(['$routeProvider', '$httpProvider','OAuthProvider','OAuthTokenProvider','appConfigProvider',
    function($routeProvider,$httpProvider,OAuthProvider,OAuthTokenProvider,appConfigProvider){
    //console.log(data);
    $httpProvider.defaults.transformResponse = function (data, headersGetter){

        var headersGetter = headersGetter();

        if (headersGetter['content-type'] == 'application/json' ||
            headersGetter['content-type'] == 'text/json' ){
            // console.log(data);
            var dataJson = JSON.parse(data);

            if (dataJson.hasOwnProperty('data')){
                dataJson = dataJson.data;
            }
            return dataJson;
        }
        return data;
    };

    $routeProvider
        .when('/login',{
            templateUrl:'build/views/login.html',
            controller:'LoginController'
        })
        .when('/home',{
            templateUrl:'build/views/home.html',
            controller:'HomeController'
        })
        .when('/clients',{
            templateUrl:'build/views/client/listAll.html',
            controller:'ClientsListControllerAll'
        })
        .when('/client/new',{
            templateUrl:'build/views/client/new.html',
            controller:'ClientNewController'
        })
        .when('/client/:id',{
            templateUrl:'build/views/client/list.html',
            controller:'ClientListController'
        })
        .when('/client/:id/edit',{
            templateUrl:'build/views/client/edit.html',
            controller:'ClientEditController'
        })
        .when('/client/:id/remove',{
            templateUrl:'build/views/client/remove.html',
            controller:'ClientRemoveController'
        })
        .when('/project/:id/notes',{
            templateUrl:'build/views/projectNote/listAll.html',
            controller:'ProjectNoteListAllController'
        })
        .when('/project/:id/note/new',{
            templateUrl:'build/views/projectNote/new.html',
            controller:'ProjectNoteNewController'
        })
        .when('/project/:id/note/:noteId',{
            templateUrl:'build/views/projectNote/list.html',
            controller:'ProjectNoteListController'
        })
        .when('/project/:id/note/:noteId/edit',{
            templateUrl:'build/views/projectNote/edit.html',
            controller:'ProjectNoteEditController'
        })
        .when('/project/:id/note/:noteId/remove',{
            templateUrl:'build/views/projectNote/remove.html',
            controller:'ProjectNoteRemoveController'
        })
        .when('/projects',{
            templateUrl:'build/views/project/listAll.html',
            controller:'ProjectListAllController'
        })
        .when('/project/new',{
            templateUrl:'build/views/project/new.html',
            controller:'ProjectNewController'
        })
        .when('/project/:id',{
            templateUrl:'build/views/project/list.html',
            controller:'ProjectListController'
        })
        .when('/project/:id/edit',{
            templateUrl:'build/views/project/edit.html',
            controller:'ProjectEditController'
        })
        .when('/project/:id/remove',{
            templateUrl:'build/views/project/remove.html',
            controller:'ProjectRemoveController'
        });
        OAuthProvider.configure({
            baseUrl: appConfigProvider.config.baseUrl,
            clientId: 'appid1',
            clientSecret: 'secret', // optional
            grantPath:'oauth/access_token',

        });

        OAuthTokenProvider.configure({
           name: 'token',
            options:{
                secure:false
            }
        });
}]);


app.run(['$rootScope', '$window', 'OAuth', function($rootScope, $window, OAuth) {
    $rootScope.$on('oauth:error', function(event, rejection) {
        // Ignore `invalid_grant` error - should be catched on `LoginController`.
        if ('invalid_grant' === rejection.data.error) {
            return;
        }

        // Refresh token when a `invalid_token` error occurs.
        if ('invalid_token' === rejection.data.error) {
            return OAuth.getRefreshToken();
        }

        // Redirect to `/login` with the `error_reason`.
        return $window.location.href = '/login?error_reason=' + rejection.data.error;
    });
}]);
