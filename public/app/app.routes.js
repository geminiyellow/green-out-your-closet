// inject ngRoute for all our routing needs
angular.module('routerRoutes', ['ngRoute'])

// configure our routes
.config(function($routeProvider, $locationProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl : 'app/views/pages/home.html',
            controller  : 'homeController',
            controllerAs: 'home',
            access: {restricted: false}
        })

        // route for the about page
        .when('/closet', {
            templateUrl : 'app/views/pages/closet.html',
            controller  : 'closetController',
            controllerAs: 'closet',
            access: {restricted: false}
        })

        .when('/magicMirror', {
            templateUrl : 'app/views/pages/magicMirror.html',
            controller  : 'mirrorController',
            controllerAs: 'mirror',
            access: {restricted: false}
        })

        .when('/login', {
            templateUrl : 'app/views/pages/login.html',
            controller  : 'loginController',
            controllerAs: 'login',
            access: {restricted: false}
        })

        .when('/register', {
            templateUrl : 'app/views/pages/register.html',
            controller  : 'registerController',
            controllerAs: 'register',
            access: {restricted: false}
        })

        .when('/logout', {
            controller  : 'logoutController',
            controllerAs: 'logout',
            access: {restricted: true}
        })

        .otherwise({
            redirectTo: '/'
        });

     

    $locationProvider.html5Mode(true);
});
