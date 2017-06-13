/**
 * Created by abhishekrathore on 2/13/17.
 */
angular.module("forum",["ngRoute","ui.bootstrap","LocalForageModule"])
//     .config(function($routeProvider){

//         $routeProvider
//             .when("/",
//                 {
//                     templateUrl: "partials/login.html",
//                     controller:"loginCtrl",
//                     controllerAs :"login"
//                 })
//             .when("/home/:id",
//                 {
//                     templateUrl: "partials/home.html",
//                     controller:"homeCtrl",
//                     controllerAs :"home"
//                 })
//             .when("/data/:topic",
//                 {
//                     templateUrl: "partials/cs.html",
//                     controller: "dataCtrl",
//                     controllerAs: "data"
//                 })
//     })
//     .service("dataService",function ($localForage) {
//         var dataServe =this ;
//         dataServe.users =[];
//         (function (users) {
//                 $localForage.getItem("users").then(function (data) {
//                     console.log(data);

//                     for(i=0;i<data.length;i++)
//                         users.push(data[i]);
//                 })
//             })(dataServe.users)
//     })
//     .controller("navCtrl",navCtrl)
//     .controller("loginCtrl",loginCtrl)
//     .controller("homeCtrl",homeCtrl)
//     .controller("popupCtrl",popupCtrl)
//     .controller("dataCtrl",dataCtrl)

// function navCtrl($rootScope,$location) {
//     var nav = this ;
//     console.log("nav");
//     $rootScope.showNav = false;
//     nav.logout = function () {
//         $location.path("/");
//         $rootScope.showNav = false;
//     }
// }


// function loginCtrl($uibModal){

//     var login = this;
//     login.animationsEnabled = true;
//     login.open = function (user) {
//         if(user) {
//             var modalInstance = $uibModal.open({
//                 animation: login.animationsEnabled,
//                 ariaLabelledBy: 'modal-title',
//                 ariaDescribedBy: 'modal-body',
//                 templateUrl: 'login.html',
//                 controller: 'popupCtrl',
//                 controllerAs: 'popup',
//                 size: 'md'
//             });
//         }
//         else {
//             var modalInstance = $uibModal.open({
//                 animation: login.animationsEnabled,
//                 ariaLabelledBy: 'modal-title',
//                 ariaDescribedBy: 'modal-body',
//                 templateUrl: 'signUp.html',
//                 controller: 'popupCtrl',
//                 controllerAs: 'popup',
//                 size: 'md'
//             });
//         }
//     }
//     login.toggleAnimation = function () {
//         login.animationsEnabled = !login.animationsEnabled;
//     }

// } //Hoisting


// function homeCtrl(dataService,$localForage,$routeParams,$timeout,$rootScope){

//     var home = this;
//     home.users =dataService.users ;
//     console.log(home.users);
//     $timeout(function () {
//         home.curruser = home.users[$routeParams.id];
//     },50);
//     $rootScope.curuser =home.curruser;
//     console.log($routeParams.id);
//     console.log("home ctrl")

// }

// function popupCtrl($location,$uibModalInstance,$rootScope,dataService,$localForage) {
//     console.log("dialog is working");
//     var popup = this;

//     popup.users =dataService.users;
//     popup.login = function () {
//         console.log("login");
//         for(i=0;i<popup.users.length;i++)
//         {
//             if((popup.users[i].name == popup.curruser.name) && (popup.users[i].pass == popup.curruser.pass))
//             {
//                 $location.path("/home/"+i);
//                 $uibModalInstance.close();
//                 $rootScope.showNav = true;
//             }
//             else
//             {
//                 popup.msg = "Seems you don't have account PLEASE SIGN UP";
//                 console.log("new user sign up");
//             }
//         }
//     }
//     popup.signup =function () {
//         console.log("sign up");
//         popup.users.push(popup.newuser);
//         $localForage.setItem("users",popup.users);
//         $location.path("/home/"+(popup.users.length-1));
//         $uibModalInstance.close();
//         $rootScope.showNav = true;
//     }
// }

// function dataCtrl($rootScope,$routeParams) {
//     console.log("data is not working");
//     var data = this ;
//     /*data.querys =[];
//     (function (querys) {
//         $localForage.getItem("querys").then(function (data) {
//             console.log(data);

//             for(i=0;i<data.length;i++)
//                 querys.push(data[i]);
//         })
//     })(data.querys)*/
//     data.user = $rootScope.curuser;
//     data.askquery = function () {
//         data.newquery.topic = $routeParams.topic ;
//         data.newquery.username = data.user;
//         data.newquery.time = new Date();
//         console.log("post work");
//         console.log(data.newquery);
//         //data.querys.push(data.newquery);
//         //$localForage.setItem("querys",data.querys);
//     }
// }