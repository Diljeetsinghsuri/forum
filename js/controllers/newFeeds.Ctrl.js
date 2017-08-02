angular.module("forum").controller("newFeedsCtrl", newFeedsCtrl)

function newFeedsCtrl($timeout, $uibModal, dataService, $rootScope) {
    var newFeeds = this;
    newFeeds.user = dataService.currUser;
    newFeeds.posts = [];
    newFeeds.comments = [1, 2];
    if (Parse.User.current()) {
        $timeout(function () {
            console.log('user in home');
            $rootScope.currentUser = Parse.User.current().toJSON();
        }, 200);
    }
    newFeeds.getData = function (num) {

        var Post = Parse.Object.extend("Post");
        var query = new Parse.Query(Post);
        query.ascending("createdAt");
        query.include("subject");
        query.include("user");
        query.find({
            success: function (results) {
                var Com = Parse.Object.extend("Comment");
                var query2 = new Parse.Query(Com);
                query2.include("user");
                query2.include("post");
                query2.find({
                    success: function (res) {
                        for (var i = 0; i < results.length; i++) {

                            for (var j = 0; j < res.length; j++) {
                                if (results[i].comments == undefined)
                                    results[i].comments = [];
                                if (results[i].id == res[j].get('post').id) {
                                    results[i].comments.push(res[j]);
                                    console.log(j)

                                }
                            }
                        }
                        $timeout(function () {
                            console.log(results);
                            newFeeds.posts = results;
                        }, 50);
                    },
                    error: function (err) {
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

    newFeeds.postComment = function (post) {
        var newCommentStr = "newComment_" + post.id;
        if (newFeeds[newCommentStr]) {
            // var commentBlockUI = blockUI.instances.get('commentBlockUI'+post.id);
            // commentBlockUI.start("posting comment...");
            var Comment = Parse.Object.extend("Comment");
            var comment = new Comment();

            comment.set("user", Parse.User.current());
            comment.set("post", post);
            comment.set("comment", newFeeds[newCommentStr]);
            comment.save(null, {
                success: function (result) {
                    $timeout(function () {
                        post.comments.push(result);
                        // commentBlockUI.stop();
                        newFeeds[newCommentStr] = "";
                    })
                },
                error: function (post, error) {
                    alert('Failed to create new object, with error code: ' + error.message);
                }
            });
        }
        else {
            alert("reply box is empty");
        }

    }
    newFeeds.deleteComment = function (comKey, postKey, comment, comments) {
        // $('#'+comment.id).css('pointer-events', 'none');
        if (confirm("Are you sure you want to delete this COMMENT ?")) {
            var Comment = Parse.Object.extend("Comment");
            var query = new Parse.Query(Comment);
            query.get(comment.id, {
                success: function (object) {
                    // The object was retrieved successfully.
                    object.destroy({
                        success: function (myObject) {
                            // The object was deleted from the Parse Cloud.
                            $timeout(function () {
                                comments.splice(comKey, 1);
                                console.log("delete comment", myObject)
                            }, 10)
                        },
                        error: function (myObject, error) {
                            console.log("errorcomment", myObject)
                            // The delete failed.
                            // error is a Parse.Error with an error code and message.
                        }
                    })
                },
                error: function (object, error) {
                    console.log("object not found");
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                }
            });
        }

    }
    newFeeds.deletePost = function (postKey, post) {
        if (confirm("Are you sure you want to delete this POST ?")) {
            if (post.comments.length > 0) {
                for (var i = 0; i < post.comments.length; i++) {
                    var Comment = Parse.Object.extend("Comment");
                    var query = new Parse.Query(Comment);
                    query.get( post.comments[i].id, {
                        success: function (object) {
                            // The object was retrieved successfully.
                            object.destroy({
                                success: function (myObject) {
                                    // The object was deleted from the Parse Cloud.
                                    $timeout(function () {
                                        console.log("delete comment", myObject)
                                    }, 10)
                                },
                                error: function (myObject, error) {
                                    console.log("errorcomment", myObject)
                                    // The delete failed.
                                    // error is a Parse.Error with an error code and message.
                                }
                            })
                        },
                        error: function (object, error) {
                            console.log("object not found");
                            // The object was not retrieved successfully.
                            // error is a Parse.Error with an error code and message.
                        }
                    });
                }
            }
            var Post = Parse.Object.extend("Post");
            var query = new Parse.Query(Post);
            query.get(post.id, {
                success: function (object) {
                    // The object was retrieved successfully.
                    object.destroy({
                        success: function (myObject) {
                            // The object was deleted from the Parse Cloud.
                             newFeeds.posts.splice(newFeeds.posts.indexOf(post), 1);
                            $timeout(function () {
                                console.log(postKey)
                                console.log(newFeeds.posts)
                               
                                console.log(newFeeds.posts)
                                console.log("delete comment", myObject)
                            }, 100)
                        },
                        error: function (myObject, error) {
                            console.log("errorcomment", myObject)
                            // The delete failed.
                            // error is a Parse.Error with an error code and message.
                        }
                    })
                },
                error: function (object, error) {
                    console.log("object not found");
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                }
            });
        }

    }

}