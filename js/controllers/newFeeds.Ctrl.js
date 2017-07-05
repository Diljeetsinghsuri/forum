angular.module("forum").controller("newFeedsCtrl", newFeedsCtrl)

function newFeedsCtrl($timeout, $uibModal) {
    var newFeeds = this;
    newFeeds.user = Parse.User.current();
    newFeeds.posts = [];
    newFeeds.comments =[1,2];
    newFeeds.getData = function(num){

        var Post = Parse.Object.extend("Post");
        var query = new Parse.Query(Post);
        query.ascending("createdAt");
        query.include("subject");
        query.include("user");
        query.find({
            success: function(results) {
                var Com = Parse.Object.extend("Comment");
                var query2 = new Parse.Query(Com);
                query.include("user");
                query.include("post");
                 query2.find({
                     success: function(res){
                         for(var i = 0; i<res.length;i++){
                             loop1:
                             for(var j=0; j<results.length; j++){
                                 if(results[j].comments == undefined)
                                 results[j].comments = [];
                                 if(results[j].id == res[i].get('post').id){
                                     results[j].comments.push(res[i]);
                                     console.log(j)
                                     break loop1;
                                 }
                             }
                         }
                         $timeout(function () {
                             console.log(results);
                             newFeeds.posts = results;
                         }, 50);
                     },
                     error: function(err){
                         alert("err");
                     }
                 })



            },
            error: function (error) {
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
        newFeeds.like = false;
        query.equalTo("objectId", user.id);
        query.find({
            success: function (list) {
                if (list.length != 0)
                    console.log(list);
                else {
                    relation.add(user);
                    post.save(null, {
                        success: function (result) {
                            console.log("likes save")
                            $timeout(function () {
                                result.increment("likesTotal");
                                result.save();
                                newFeeds.likeClass[post.id] = "active";
                            }, 50);
                        },
                        error: function () {
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
        if (url) {
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

    newFeeds.postComment = function(post){
        if(newFeeds.newComment){
        // var commentBlockUI = blockUI.instances.get('commentBlockUI'+post.id);
        // commentBlockUI.start("posting comment...");
        var Comment = Parse.Object.extend("Comment");
            var comment = new Comment();

            comment.set("user", Parse.User.current());
            comment.set("post", post);
            comment.set("comment", newFeeds.newComment );
            comment.save(null, {
                success: function(result) {
                    $timeout(function () {
                        post.comments.push(result);
                        // commentBlockUI.stop();
                        newFeeds.newComment = "";
                    })
                },
                error: function(post, error) {
                    alert('Failed to create new object, with error code: ' + error.message);
                }
            });
        }
        else{
            alert("reply box is empty");
        }
     
    }

}