/**
 * Created by Diljeet on 17-02-2017.
 */
angular.module("forum").config(function($routeProvider){

    $routeProvider
        .when("/",
            {
                templateUrl: "partials/login.html",
                controller:"loginCtrl",
                controllerAs :"login",
            })
        .when("/home",
            {
                templateUrl: "partials/home.html",
                controller:"homeCtrl",
                controllerAs :"home"
            })
        .when("/data/:id",
            {
                templateUrl: "partials/cs.html",
                controller: "dataCtrl",
                controllerAs: "data"
            })
        .when("/admin",
            {
                templateUrl: "partials/admin.html",
                controller: "adminCtrl",
                controllerAs: "admin"
            })
})
    .run(function ($location,$timeout,$rootScope) {
        Parse.initialize("myAppId");
        Parse.serverURL = 'https://glacial-sands-81357.herokuapp.com/parse';
        var user =Parse.User.current();
        if(user)
        {
            if(user.attributes.username == "admin")
            $timeout(function () {
                $location.path('/admin');
                $rootScope.showNav = true;
            },50)
            else
                $timeout(function (){
                    $location.path('/home');
                    $rootScope.showNav = true;
                },50)
        }
        else
        {
            $location.path('/');
        }
    })