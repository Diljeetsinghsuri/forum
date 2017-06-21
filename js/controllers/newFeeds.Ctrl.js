angular.module("forum").controller("newFeedsCtrl",newFeedsCtrl)

function newFeedsCtrl($timeout, $uibModal){
    var newFeeds = this;
    newFeeds.user = Parse.User.current();
    newFeeds.posts = [];
    newFeeds.getData = function(num){
        var Post = Parse.Object.extend("Post");
        var query = new Parse.Query(Post);
        query.ascending("createdAt");
        query.include("subject");
        query.include("user");
        query.find({
            success: function(results) {
                $timeout(function () {
                    console.log(results);
                    newFeeds.posts = results;
                },50);


            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }
    newFeeds.getData(0);
    newFeeds.likePost = function (post) {
        console.log(post.get("likes"));
        var user = Parse.User.current();
        var relation = post.relation("likes");
        var query = relation.query();
        newFeeds.like = false ;
        query.equalTo("objectId",user.id);
        query.find({
            success: function (list) {
                if(list.length != 0)
                    console.log(list);
                else
                {
                    relation.add(user);
                    post.save(null,{
                        success: function(result) {
                            console.log("likes save")
                            $timeout(function () {
                                result.increment("likesTotal");
                                result.save();
                                newFeeds.likeClass[post.id] = "active";
                            },50);
                        },
                        error: function(){
                            console.log("not save")
                        }
                    });
                }
            },
            error: function (error) {
                console.log(error);
            }
        });

    }

    newFeeds.openLightBox = function (url) {
        if(url){
           var modalInstance = $uibModal.open({
                                    animation: true,
                                    ariaLabelledBy: 'modal-title',
                                    ariaDescribedBy: 'modal-body',
                                    templateUrl: 'partials/lightBox.html',
                                    controller: 'lightboxCtrl',
                                    controllerAs: 'lightbox',
                                    backdrop: 'static', 
                                    keyboard: true,
                                    size: 'lg',
                                    resolve: {
                                        imageUrl: function () {
                                            return url;
                                        }
                                    }
           })
        }
    }

}