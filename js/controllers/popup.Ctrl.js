/**
 * Created by Diljeet on 17-02-2017.
 */
angular.module("forum").controller("popupCtrl",popupCtrl)

function popupCtrl($location,$uibModalInstance,$rootScope,dataService,$timeout,$localForage) {
    console.log("dialog is working");
    var popup = this;
    popup.curruser = {};
    popup.newuser = {};
    popup.users =dataService.users;
    popup.login = function () {
        if(popup.curruser.name && popup.curruser.pass){
            Parse.User.logIn(popup.curruser.name, popup.curruser.pass, {
                success: function(user) {
                    console.log(user);
                    if(user.attributes.username == "admin")
                    {
                        dataService.currUser = Parse.User.current()
                        $location.path("/admin");
                        $uibModalInstance.close();
                        $rootScope.showNav = true;
                    }
                    else
                    {
                        dataService.currUser = Parse.User.current()
                        $location.path("/newFeeds");
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
        else{
            popup.msg = "Fill all fields";
        }
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
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(popup.newuser.email)){
            var user = new Parse.User();
            user.set("username", popup.newuser.name);
            user.set("password", popup.newuser.pass);
            user.set("email", popup.newuser.email);
             user.set("name", popup.newuser.name);

            user.signUp(null, {
                success: function(user) {
                    // Hooray! Let them use the app now.
                    var UserData = Parse.Object.extend("UserData");
                    var userData = new UserData();
                    userData.set("email",popup.newuser.email);
                    userData.set("user",user);
                    userData.save(null,{
                        success: function(success){
                            $location.path("/newFeeds");
                            $uibModalInstance.close();
                            $rootScope.showNav = true;
                        },
                        error:function(err){
                            console.log(err);
                        }
                    })
                },
                error: function(user, error) {
                    // Show the error message somewhere and let the user try again.
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        }
        else{
            alert("ereeoee")
        }
    }
    popup.fbEmail = function(){
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(popup.curruser.email)){
            var user =Parse.User.current();
            user.set("email", popup.curruser.email);
            user.save(null,{
                success:function(success){
                    var UserData = Parse.Object.extend("UserData");
                    var userData = new UserData();
                    userData.set("email",popup.curruser.email);
                    userData.set("user",user);
                    userData.save(null,{
                        success: function(success){
                            $uibModalInstance.close();
                        },
                        error:function(err){
                            console.log(err);
                        }
                    })
                },
                error: function(error){
                    console.log(error)
                    if(error.code == 203){
                        $timeout(function(){popup.msg = "User Already exsist with this email";},50)
                    }
                }
            })
        }
        else{
            popup.msg = "Fill all fields";
        }
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
