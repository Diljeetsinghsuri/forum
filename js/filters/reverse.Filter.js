/**
 * Created by Diljeet on 17-02-2017.
 */
angular.module("forum").filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
})