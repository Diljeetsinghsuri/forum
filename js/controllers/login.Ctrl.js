/**
 * Created by Diljeet on 17-02-2017.
 */
angular.module("forum").controller("loginCtrl",loginCtrl)

function loginCtrl($uibModal, $location, $rootScope, $timeout, dataService){

    var login = this;
    login.profilepic = "#"
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

    login.fbOpen = function () {
        window.FB.login(function(authData) {
            if (authData.authResponse) {
                console.log(authData)
                FB.api('/me', function(response) {
                    console.log(response);
                    var facebookAuthData = {
                        id: authData.authResponse.userID,
                        access_token: authData.authResponse.accessToken,
                        expiration_date: (new Date().getTime() + 1000).toString()
                    };

                    Parse.FacebookUtils.logIn(facebookAuthData).then(
                        function(){
                            var user = Parse.User.current();
                            user.set("name",response.name)
                            user.save().then(function(){
                                if(!user.get("email")){
                                var modalInstance = $uibModal.open({
                                    animation: login.animationsEnabled,
                                    ariaLabelledBy: 'modal-title',
                                    ariaDescribedBy: 'modal-body',
                                    templateUrl: 'getEmail.html',
                                    controller: 'popupCtrl',
                                    controllerAs: 'popup',
                                    backdrop: 'static', 
                                    keyboard: false,
                                    size: 'md'})
                                }
                                $timeout(function () {
                                    $rootScope.showNav = true ;
                                    dataService.currUser = Parse.User.current();
                                    $location.path("/newFeeds");
                                    
                                },50)
                            });
                        }

                    );

                });

            } else {
                // mimic facebook sdk error format
                console.log('User cancelled login or did not fully authorize.')

            }
        },{scope: 'email'})
    }
} //Hoisting
