/**
 * Created by Diljeet on 22-02-2017.
 */
angular.module("forum").filter('category', function () {
    return function (items, search) {
        var result = [];
        angular.forEach(items, function (value, key) {
            angular.forEach(value, function (value2, key2) {
                if (value2 === search) {
                    result.push(value2);
                }
            })
        });
        return result;

    }
});