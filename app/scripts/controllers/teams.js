'use strict';

/**
 * @ngdoc function
 * @name bclLiveApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the bclLiveApp
 */
angular.module('bclLiveApp')
  .controller('teamCtrl', function ($scope) {
    $scope.teamDetails = [
      {
        name : 'BrillianT Eagles',
        captain : 'Kunal Mazumdar',
        logo : 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/1241px-Chennai_Super_Kings_Logo.svg.png'
      },
      {
        name : 'BrillianT Warriors',
        captain : 'Tom Hardy',
        logo : 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4f/Greenville_Road_Warriors_logo.svg/1055px-Greenville_Road_Warriors_logo.svg.png'
      },
      {
        name : 'Ko Ka Re Ko',
        captain : 'Adam Levine',
        logo : 'http://www.ipl2016liveupdates.com/wp-content/uploads/2016/01/royal-challengers-bangalore-team-logo-ipl-9-2016.png'
      }
    ]
  })
  .controller('playerCtrl', function($scope, $routeParams){
    $scope.selectedTeam = $routeParams.name;
    $scope.teamPlayers = [
      {
        name : 'Kunal Mazumdar',
        project : 'Test Automation COE',
        hobby : 'Singing'
      },
      {
        name : 'Sana Paramesh',
        project : 'Performance COE',
        hobby : 'Trekking'
      }
    ]
  })
  .controller('fixtureCtrl', function($scope, $timeout){
    $scope.loading = 'active';
    $scope.fixtures = [
      {
        team1 : 'BrillianT Eagles',
        team2 : 'BrillianT Warriors',
        time : '7:30 AM',
        groundNo : 'Ground #1',
        status : 'Yet to start',
        statusColor : 'blue',
        result : '-'
      },
      {
        team1 : 'Ko Ka Re Ko',
        team2 : 'BrillianT Warriors',
        time : '8:30 AM',
        groundNo : 'Ground #2',
        status : 'Finished',
        statusColor : 'yellow',
        result : 'Ko Ka Re Ko won by 2 wickets'
      },
      {
        team1 : 'Kai po che',
        team2 : 'Hurfanmoula XI',
        time : '9:30 AM',
        groundNo : 'Ground #3',
        status : 'Cancelled',
        statusColor : 'red',
        result : 'Match cancelled due to rain.'
      }
    ]

    $scope.$on('$routeChangeSuccess', function () {
        $scope.loading = 'active';
        $timeout(function(){
          $scope.loading = '';
        }, 2000);
    });
  });
