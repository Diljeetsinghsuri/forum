/**
 * Created by Diljeet on 17-02-2017.
 */
angular.module("forum").controller("homeCtrl", homeCtrl)

function homeCtrl(dataService, $localForage, $routeParams, $timeout, $uibModal, $scope, $rootScope) {

    var home = this;
    home.user = Parse.User.current().attributes;
    console.log(home.user);
    console.log(Parse.User.current());
    if (Parse.User.current()) {
        $timeout(function () {
            $rootScope.currentUser = Parse.User.current().toJSON();
        }, 200);
    }

    var Post = Parse.Object.extend("Post");
    var query = new Parse.Query(Post);
    query.equalTo("user", Parse.User.current());
    query.descending("updatedAt");
    query.find({
        success: function (result) {
            var Com = Parse.Object.extend("Comment");
            var query2 = new Parse.Query(Com);
            query2.equalTo("user", Parse.User.current());
            query2.descending("updatedAt");
            query2.find({
                success: function (comments) {
                     $timeout(function () {
                    home.activities = result.concat(comments);
                    home.activities.sort(function (a, b) {
                        return new Date(b.attributes.updatedAt) - new Date(a.attributes.updatedAt);
                    })
                    console.log(home.activities);
                     }, 50)
                }
            })
        },
        error: function (error) {
            console.log(error);
        }
    })

    /* home.openQuery = function (query) {
         home.queryModal = query;
         var modalInstance = $uibModal.open({
             animation: home.animationsEnabled,
             ariaLabelledBy: 'modal-title',
             ariaDescribedBy: 'modal-body',
             templateUrl: 'query.html',
             scope: $scope,
             size: 'md'
         });
     }*/
    /*home.users =dataService.users ;
     console.log(home.users);
     $timeout(function () {
     home.curruser = home.users[$routeParams.id];
     },50);
     $rootScope.curuser =home.curruser;
     console.log($routeParams.id);
     console.log("home ctrl")*/

}
