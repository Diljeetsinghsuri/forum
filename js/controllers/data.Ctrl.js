/**
 * Created by Diljeet on 17-02-2017.
 */
angular.module("forum").controller("dataCtrl",dataCtrl)

function dataCtrl($rootScope,$routeParams,dataService,$timeout,$uibModal) {
    console.log("data is not working");
    var data = this ;
    data.user = Parse.User.current();
    data.textClass ="";
    data.imgPath = "";
    data.divImg =false;
    data.divId = false;
    data.disPost = [];
    data.likeClass = [];
    data.menuName = dataService.currSub.toJSON().name;
    console.log(data.menuName);
    console.log($routeParams.id);

    /*retrieving attachments */
    var Attachment = Parse.Object.extend("Attachment");
    var query = new Parse.Query(Attachment);
    query.equalTo("subject", dataService.currSub);
    query.find({
        success: function (results) {
            $timeout(function () {
                data.disAttach = results;
                console.log(data.disAttach);
            },50);

        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
        }
    })

    /*retrieving posts */
    var Post = Parse.Object.extend("Post");
    var query = new Parse.Query(Post);
    query.equalTo("subject", dataService.currSub);
    query.include("user");
    query.find({
        success: function(results) {
             var Com = Parse.Object.extend("Comment");
                var query2 = new Parse.Query(Com);
                query2.include("user");
                query2.include("post");
                 query2.find({
                     success: function(res){
                         for(var i = 0; i<results.length;i++){
                             
                             for(var j=0; j<res.length; j++){
                                 if(results[i].comments == undefined)
                                 results[i].comments = [];
                                 if(results[i].id == res[j].get('post').id){
                                     results[i].comments.push(res[j]);
                                     console.log(j)
                                     
                                 }
                             }
                         }
                         $timeout(function () {
                             console.log(results);
                             data.disPost = results;
                         }, 50);
                     },
                     error: function(err){
                         alert("err");
                     }
                 })
            // $timeout(function () {
            //     data.disPost = results ;
            //     console.log(results);
            //     console.log(data.disPost);
            //     for(i=0;i<data.disPost.length;i++)
            //         console.log(data.disPost[i].attributes.user.attributes)
            // },50);


        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });


    console.log(dataService.currSub.attributes);

    /*Posting query*/
    data.postQuery = function () {
        if(data.query)
        {
            var Post = Parse.Object.extend("Post");
            var post = new Post();

            post.set("user", Parse.User.current());
            post.set("subject", dataService.currSub);
            post.set("data", data.query );
            if(data.imgPath)
                post.set("image",data.imgPath)

            post.save(null, {
                success: function(post) {
                    $timeout(function () {
                        data.disPost.push(post);
                        data.divImg = false ;
                        data.divId = false;
                        data.query = "";
                        data.textClass = "";
                        data.attach = "";
                    })
                },
                error: function(post, error) {
                    alert('Failed to create new object, with error code: ' + error.message);
                }
            });
        }
        else
            data.textClass = "requiredPost";
    }
    data.uploadPostImage = function () {
        data.divId = true;
        var d = new Date();
        var name = d.getTime() + data.attach.name;
        var parseFile = new Parse.File(name, data.attach);
        parseFile.save().then(function (success) {
            $timeout(function () {
                console.log(success);
                data.imgPath = success;
                data.divId =false;
                data.divImg = true;
            },50)
        }, function (error) {
            console.log(error);
        });
    }

    data.likePost = function (post) {
        console.log(post.get("likes"));
        var user = Parse.User.current();
        var relation = post.relation("likes");
        var query = relation.query();
        data.like = false ;
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
                                data.likeClass[post.id] = "active";
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
    data.openLightBox = function (url) {
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

    data.postComment = function(post){
        var newCommentStr = "newComment_" + post.id;
        if(data[newCommentStr]){
        // var commentBlockUI = blockUI.instances.get('commentBlockUI'+post.id);
        // commentBlockUI.start("posting comment...");
        var Comment = Parse.Object.extend("Comment");
            var comment = new Comment();

            comment.set("user", Parse.User.current());
            comment.set("post", post);
            comment.set("comment", data[newCommentStr] );
            comment.save(null, {
                success: function(result) {
                    $timeout(function () {
                        post.comments.push(result);
                        // commentBlockUI.stop();
                        data[newCommentStr] = "";
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




    /*data.querys =[];
     (function (querys) {
     $localForage.getItem("querys").then(function (data) {
     console.log(data);

     for(i=0;i<data.length;i++)
     querys.push(data[i]);
     })
     })(data.querys)*/

    /*data.user = $rootScope.curuser;

     /*data.askquery = function () {
     data.newquery.topic = $routeParams.topic ;
     data.newquery.username = data.user;
     data.newquery.time = new Date();
     console.log("post work");
     console.log(data.newquery);
     //data.querys.push(data.newquery);
     //$localForage.setItem("querys",data.querys);
     }*/
}