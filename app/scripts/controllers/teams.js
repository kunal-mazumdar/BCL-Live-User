'use strict';

/**
 * @ngdoc function
 * @name bclLiveApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the bclLiveApp
 */
angular.module('bclLiveApp')
  .controller('teamCtrl', function ($scope, $firebaseObject, $firebaseArray, fbServ) {
    $scope.refTeam = new Firebase(atob(fbServ.fbob)+"/teams");
    var obj = $firebaseArray($scope.refTeam);

    obj.$loaded().then(function(){
      $scope.teamDetails = obj;
      console.log('teams: ', $scope.teamDetails);
      $scope.dataLoaded = true;
    });

    $scope.addTeam = function(){
      $scope.teamDetails.$add({
        name: $scope.teamNameUi,
        dept: $scope.teamDeptUi,
        captain: $scope.captainUi,
        logo: $scope.logoUrlUi
      }).then(function(){
        var id = $scope.teamDetails.key();
        console.log("Added team with id " + id);
        $scope.teamDetails.$indexFor(id); // returns location in the array
      });
    }
  })
  .controller('playerCtrl', function($scope, $routeParams, $firebaseObject, $firebaseArray){
    $scope.teamId = $routeParams.id;
    $scope.teamName = $routeParams.name;
    $scope.refTeam = new Firebase(atob(fbServ.fbob)+"/teams/"+ $scope.teamId +"/players");
    var obj = $firebaseArray($scope.refTeam);

    obj.$loaded().then(function(){
      $scope.teamPlayers = obj;
      console.log('players: ', $scope.teamPlayers);
      $scope.dataLoaded = true;
    });

    $scope.addPlayer = function(){
      $scope.teamPlayers.$add({
        name: $scope.playerNameUi,
        project: $scope.projectNameUi
      }).then(function(){
        var id = $scope.teamPlayers.key();
        console.log("Added player with id " + id);
        $scope.teamPlayers.$indexFor(id); // returns location in the array
      });
    }
  })
