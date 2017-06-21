/**
 * Created by Diljeet on 17-02-2017.
 */
angular.module("forum")
.service("dataService",function ($localForage) {
    var dataServe =this ;
    dataServe.currSub = {};
    dataServe.users =[];
    (function (users) {
        $localForage.getItem("users").then(function (data) {
            console.log(data);

            for(i=0;i<data.length;i++)
                users.push(data[i]);
        })
    })(dataServe.users)
})