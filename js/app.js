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

    .controller("loginCtrl",loginCtrl)
    .controller("homeCtrl",homeCtrl)
    .controller("popupCtrl",popupCtrl)




function loginCtrl($location,$uibModal){
    
    var login = this;

        login.submit = function() {

            console.log(login.user);
            $location.path("/home")
            
        }
    login.animationsEnabled = true;
    login.open = function (parentSelector) {
        var modalInstance = $uibModal.open({
            animation: login.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'popupCtrl',
            controllerAs: '$ctrl',
            size: 'md'
        });
    }
    login.toggleAnimation = function () {
        login.animationsEnabled = !login.animationsEnabled;
    }
        
} //Hoisting


function homeCtrl(){

    var home = this;


    console.log("home ctrl")

}

function popupCtrl() {
    console.log("dialog is working");
}