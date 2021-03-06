/**
 * Created by Diljeet on 17-02-2017.
 */
angular.module("forum").controller("navCtrl", navCtrl)

function navCtrl($rootScope, $location, $timeout, dataService) {
    var nav = this;
    console.log("nav");
    $rootScope.showNav = false;
    nav.subEce = [];
    nav.subEe = [];
    nav.subCom = [];
    if (Parse.User.current()) {
        $timeout(function () {
            console.log('userupdated');
            $rootScope.currentUser = Parse.User.current().toJSON();
        }, 200);
    }
    console.log(nav.currentUser);
    //$rootScope.aboutUs = true;
    nav.hideAboutUs = function (value) {
        $rootScope.aboutUs = value;
    }
    var Subject = Parse.Object.extend("Subject");
    var query = new Parse.Query(Subject);
    query.find({
        success: function (results) {
            $timeout(function () {
                for (i = 0; i < results.length; i++) {
                    if (results[i].attributes.category == "ECE")
                        nav.subEce.push(results[i]);
                    else if (results[i].attributes.category == "EE")
                        nav.subEe.push(results[i]);
                    else
                        nav.subCom.push(results[i]);
                }
            }, 50);
            console.log(nav.sub[0].attributes)

        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

    nav.logout = function () {
        Parse.User.logOut().then(function (success) {
            console.log(success);
            console.log(Parse.User.current());
            $timeout(function () {
                $location.path("/");
                $rootScope.showNav = false;
            }, 50)
        }, function (error) {
            console.log(error);
        });

    }

    nav.selectSub = function (currSub) {
        dataService.currSub = currSub;
        $location.path('/data/' + currSub.id);
        $("#navbarCollapse").collapse('hide');
    }
}
