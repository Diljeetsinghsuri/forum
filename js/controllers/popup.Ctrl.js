/**
 * Created by Diljeet on 17-02-2017.
 */
angular.module("forum").controller("popupCtrl",popupCtrl)

function popupCtrl($location,$uibModalInstance,$rootScope,dataService,$timeout,$localForage) {
    console.log("dialog is working");
    var popup = this;

    popup.users =dataService.users;
    popup.login = function () {
        Parse.User.logIn(popup.curruser.name, popup.curruser.pass, {
            success: function(user) {
                console.log(user);
                if(user.attributes.username == "admin")
                {
                    $location.path("/admin");
                    $uibModalInstance.close();
                    $rootScope.showNav = true;
                }
                else
                {
                    $location.path("/home");
                    $uibModalInstance.close();
                    $rootScope.showNav = true;
                }

                // Do stuff after successful login.
            },
            error: function(user, error) {
                $timeout(function(){
                    popup.msg = "Seems you don't have account PLEASE SIGN UP";
                    console.log("new user sign up");
                },50)
                // The login failed. Check error to see why.
            }
        });
    }
    /*popup.login = function () {
     console.log("login");
     for(i=0;i<popup.users.length;i++)
     {
     if((popup.users[i].name == popup.curruser.name) && (popup.users[i].pass == popup.curruser.pass))
     {
     $location.path("/home/"+i);
     $uibModalInstance.close();
     $rootScope.showNav = true;
     }
     else
     {
     popup.msg = "Seems you don't have account PLEASE SIGN UP";
     console.log("new user sign up");
     }
     }
     }*/
    popup.signup =function () {
        var user = new Parse.User();
        user.set("username", popup.newuser.name);
        user.set("password", popup.newuser.pass);
        user.set("email", popup.newuser.email);

        user.signUp(null, {
            success: function(user) {
                // Hooray! Let them use the app now.
                $location.path("/home");
                $uibModalInstance.close();
                $rootScope.showNav = true;
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }

    /*popup.signup =function () {
     console.log("sign up");
     popup.users.push(popup.newuser);
     $localForage.setItem("users",popup.users);
     $location.path("/home/"+(popup.users.length-1));
     $uibModalInstance.close();
     $rootScope.showNav = true;
     }*/
}
