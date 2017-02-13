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




function loginCtrl($location){
    
    var login = this;

        login.submit = function() {

            console.log(login.user);
            $location.path("/home")
            
        }
    
} //Hoisting


function homeCtrl(){

    var home = this;


    console.log("home ctrl")

}
