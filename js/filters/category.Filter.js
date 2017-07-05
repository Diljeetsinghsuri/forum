/**
 * Created by Diljeet on 22-02-2017.
 */
angular.module("forum")
    .filter('category', function () {
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
    })
    .filter('capitalize', function () {
        return function (input) {
            return (!!input) ? input.split(' ').map(function (wrd) {
                return wrd.charAt(0).toUpperCase() + wrd.substr(1).toLowerCase();
            }).join(' ') : '';
        }
    })
    .filter('capitalizeFirstWord', function () {
        return function (string) {
            if (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
            else {
                return string;
            }
        }
    })