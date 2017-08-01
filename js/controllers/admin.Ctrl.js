/**
 * Created by Diljeet on 20-02-2017.
 */
angular.module("forum").controller("adminCtrl",adminCtrl)

function adminCtrl($timeout, $uibModal) {
    console.log("admin is working");
    var admin =this ;
    admin.divId = [];
    admin.subjects=[];
    admin.newPosts=[];
    admin.usersList =[];
    admin.textClass="";
    admin.loadId = false;
    var Subject = Parse.Object.extend("Subject");
    var query = new Parse.Query(Subject);
    query.find({
        success: function(results) {
            $timeout(function () {
                admin.subjects = results ;
                console.log(admin.subjects);
            },50);
            console.log(admin.subjects[0].attributes)

        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
    
    
    var Post = Parse.Object.extend("Post");
    var query = new Parse.Query(Post);
    query.equalTo("reply",undefined);
    query.include("subject");
    query.include("user");
    query.find({
        success: function(results) {
            $timeout(function () {
                admin.newPosts = results;
                var UserData = Parse.Object.extend("UserData");
                var query = new Parse.Query(UserData);
                query.include("user")
                query.find({
                    success: function (result) {
                        console.log(result)
                        admin.usersList = result
                        for (var i = 0; i < admin.newPosts.length; i++) {
                            for (var j = 0; j < admin.usersList.length; j++) {
                                //console.log(admin.newPosts[i].get("user"));
                                if(admin.newPosts[i].get("user") != undefined && admin.usersList[j].get("user") != undefined )
                                {
                                    if (admin.newPosts[i].get("user").id === admin.usersList[j].get("user").id) {
                                    admin.newPosts[i].email = admin.usersList[j].get("email");
                                    // console.log("found email",admin.usersList[j].get("email"));
                                    // console.log(admin.newPosts[i].get("likes"))
                                }
                            }
                            }
                        }
                        $timeout(function(){console.log(admin.newPosts)},10)
                    },
                    error: function(err){
                        console.log(err);
                    }
                })
            },50);


        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
   


    admin.reply = function (post) {
        if (admin.replyQuery != undefined) {
            if(admin.replyQuery[post.id]!= "" && admin.replyQuery[post.id]!= null) {
                console.log("yes");
                admin.textClass = "";
                 post.set("reply", admin.replyQuery[post.id]);
                 post.save(null, {
                 success: function (result) {
                    $timeout(function () {
                        console.log(result);
                        admin.divId[post.id] = post.id;
                        console.log(admin.divId);
                        admin.textClass = "";
                        var data = {
                            to: 'diljeet.suri@gmail.com',
                            subject: 'Reply to Your Query',
                            text: admin.replyQuery[post.id]
                        };
                        Parse.Cloud.run("sendMail", data).then(function(result) {
                            // make sure the set the enail sent flag on the object
                            console.log("result :",  result);
                        }, function(error) {
                            console.log(  error);
                            // error
                        });
                        }, 50)
                 },
                 error: function (error) {
                 alert("Error : " + error.code + " " + error.message);
                 }
                 });
            } else
                admin.textClass = "requiredPost";
        } else {
            admin.textClass = "requiredPost";
        }
        /**/
    }

    admin.uploadFile = function (subject) {
        if((admin.disName != undefined && admin.disName != "") && (subject != undefined && subject !="") && (admin.attach != undefined || admin.attach != null)) {
            console.log(subject);
            console.log(admin.disName);
            console.log(admin.attach);
            admin.class1 = "";
            admin.class2 = "";
            admin.class3 = "";
            var Attachment = Parse.Object.extend("Attachment");
            var attachment = new Attachment();
            attachment.set("name",admin.disName);
            attachment.set("subject",subject);
            attachment.set("file",admin.attachUrl);
            attachment.save(null,{
                success: function (result) {
                    $timeout(function () {
                        console.log(result);
                        admin.disName = "";
                        admin.attach = "";
                        admin.subject = "";
                    })
                },
                error: function (error) {
                    console.log(error);
                }
            })

        }
        else
        {
            if(admin.disName == undefined || admin.disName == "")
                admin.class1 = "requiredPost"
            else
                admin.class1="";
            if(subject == undefined || subject =="")
                admin.class2 = "requiredPost"
            else
                admin.class2 = "";
            if(admin.attach == undefined || admin.attach == "")
                admin.class3 = "requiredPost";
            else
                admin.class3 = "";
        }
    }


    admin.uploadAttach = function () {
        admin.loadId = true;
        var d = new Date();
        var name = d.getTime() + admin.attach.name;
        var parseFile = new Parse.File(name, admin.attach);
        parseFile.save().then(function (success) {
            $timeout(function () {
                console.log(success);
                admin.attachUrl = success;
                admin.loadId = false;
            }, 50)
        }, function (error) {
            console.log(error);
        });
    }

    admin.openLightBox = function (url) {
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