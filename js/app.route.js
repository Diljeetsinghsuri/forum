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
                controllerAs: "admin",
                resolve : {
                    check : function($location){
                        var user =Parse.User.current();
                        if(user.attributes.username != "admin")
                        {
                            $location.path('/newFeeds');
                        }
                        else
                            $location.path('/admin');
                    }
                }
            })
        .when("/newFeeds",
            {
                templateUrl: "partials/newFeeds.html",
                controller: "newFeedsCtrl",
                controllerAs: "newFeeds"
            })
})
    .run(function ($location, $timeout, $rootScope) {
        $rootScope.aboutUs = false;
        Parse.initialize("myAppId");
        Parse.serverURL = 'https://forum-app-gate.herokuapp.com/parse';
        Parse.masterKey = 'myMasterKey';
        var user =Parse.User.current();
        if(user)
        {
            $rootScope.aboutUs = false;
            if(user.attributes.username == "admin")
            $timeout(function () {
                $location.path('/admin');
                $rootScope.showNav = true;
            },50)
            else
                $timeout(function (){
                    $location.path('/newFeeds');
                    $rootScope.showNav = true;
                },50)
        }
        else
        {
            $rootScope.aboutUs = true;
            $location.path('/');
        }
        $rootScope.selectedNav = 'feeds';
    })