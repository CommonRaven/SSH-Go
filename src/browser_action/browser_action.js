/**
 * Created by Nitai J. Perez
 * nitai.perez@gmail.com
 * on 29/08/2015
 */

var bg = chrome.extension.getBackgroundPage();

function uuid() { // @formatter:off
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, a => (a ^ Math.random() * 16 >> a / 4).toString(16)
)
}// @formatter:on

angular.module('sshgo', ['ngStorage'])

    .controller('browserAction', function ($scope, $localStorage) {

        $scope.sortableCols = [
            {
                text: 'Instance Name',
                key: 'name'
            }, {
                text: 'Hostname',
                key: 'hostname'
            }, {
                text: 'Last Updated',
                key: 'lastMod'
            }];

        $scope.$ls = $localStorage;

        if(!$scope.$ls.hosts){
            $scope.$ls.hosts = []
        }

        $scope.fromNow = function (date) {
            return moment(date).fromNow().replace('a few ', '')
        };

        $scope.launchHost = function (hostname) {
            bg.openHost(hostname.trim(), $scope.$ls.killtab);
        };

        $scope.createHost = function (skipLaunch) {
            console.log($scope.mainhost)
            if(!$scope.mainhost.length){
                return;
            }
            $scope.mainhost = $scope.mainhost.trim();
            console.log($scope.$ls.hosts)
            if (_.findIndex($scope.$ls.hosts, {hostname: $scope.mainhost}) === -1) {
                console.log('add')
                $scope.$ls.hosts.unshift({
                    id: uuid(),
                    name: $scope.mainame.trim(),
                    hostname: $scope.mainhost.trim(),
                    lastMod: Date.now()
                });
            }
            if (skipLaunch !== false) $scope.launchHost($scope.mainhost);
        };

        $scope.rmHost = function (hostID) {
            _.remove($scope.$ls.hosts, function (host) {
                return host.id == hostID;
            });
        };

        $scope.renameHost = function (host) {
            _.map($scope.$ls.hosts, function (h) {
                if (h.id != host.id) return h;
                h.name = prompt(`Rename host '${host.name}'`, host.name) || name;
                return h;
            })
        };

        // $scope.$ls.sortType = 'Hostname'; // set the default sort type
        // $scope.$ls.sortReverse = false;  // set the default sort order
        // $scope.$ls.searchFish = '';     // set the default search/filter term
    });