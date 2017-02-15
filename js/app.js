/**
 * Created by abhishekrathore on 2/13/17.
 */
angular.module("forum",["ngRoute","ui.bootstrap"])
    .config(function($routeProvider){

        $routeProvider
            .when("/",
                {
                    templateUrl: "partials/login.html",
                    controller:"loginCtrl",
                    controllerAs :"login"
                })
            .when("/home",
                {
                    templateUrl: "partials/home.html",
                    controller:"homeCtrl",
                    controllerAs :"home"
                })

    })
    .service("dataService",function () {
        var dataServe =this ;
        dataServe.users =[];
    })
    .controller("navCtrl",navCtrl)
    .controller("loginCtrl",loginCtrl)
    .controller("homeCtrl",homeCtrl)
    .controller("popupCtrl",popupCtrl)


function navCtrl($rootScope) {
    var nav = this ;
    console.log("nav");
    $rootScope.showNav = false;
}


function loginCtrl($uibModal){

    var login = this;
    login.animationsEnabled = true;
    login.open = function (user) {
        if(user) {
            var modalInstance = $uibModal.open({
                animation: login.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'login.html',
                controller: 'popupCtrl',
                controllerAs: 'popup',
                size: 'md'
            });
        }
        else {
            var modalInstance = $uibModal.open({
                animation: login.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'signUp.html',
                controller: 'popupCtrl',
                controllerAs: 'popup',
                size: 'md'
            });
        }
    }
    login.toggleAnimation = function () {
        login.animationsEnabled = !login.animationsEnabled;
    }

} //Hoisting


function homeCtrl(dataService){

    var home = this;
    home.users =dataService.users ;

    console.log("home ctrl")

}

function popupCtrl($location,$uibModalInstance,$rootScope,dataService) {
    console.log("dialog is working");
    var popup = this;
    popup.users =dataService.users;
    popup.login = function () {
        console.log("login");
        $location.path("/home");
        $uibModalInstance.close();
        $rootScope.showNav = true;
    }
    popup.signup =function () {
        console.log("sign up");
        popup.users.push(popup.newuser);
        $location.path("/home");
        $uibModalInstance.close();
        $rootScope.showNav = true;
    }
}