'use strict';

/**
 * @ngdoc function
 * @name bclLiveApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the bclLiveApp
 */
angular.module('bclLiveApp')
  .controller('fixtureCtrl', function($scope, $firebaseObject, $firebaseArray, $timeout, fbServ){
    $scope.refFixture = new Firebase(atob(fbServ.fbob)+"/fixtures");
    var obj = $firebaseArray($scope.refFixture);
    obj.$loaded().then(function(){
      $scope.fixtures = obj;
      console.log('fixtures: ', $scope.fixtures);
      $scope.dataLoaded = true;
    });

    $scope.refTeam = new Firebase(atob(fbServ.fbob)+"/teams");
    var objT = $firebaseArray($scope.refTeam);
    objT.$loaded().then(function(){
      $scope.teamDetails = objT;
    });

    $scope.addFixture = function(){

      if($scope.team1Ui && $scope.team2Ui && $scope.team1Ui != $scope.team2Ui){
        /* Get team 1 object */
        $scope.refTeam1 = new Firebase(atob(fbServ.fbob)+"/teams/"+$scope.team1Ui);
        var objTeam1 = $firebaseArray($scope.refTeam1);
        objTeam1.$loaded().then(function(){
          $scope.team1 = {
            id: $scope.team1Ui,
            totalRunsScored: 0,
            totalBallsFaced: 0,
            totalBallsDelivered: 0,
            totalWicketsLost: 0,
            totalSixes: 0,
            totalFours: 0,
            wicketsTaken: 0,
            totalWides: 0,
            totalNoBalls: 0,
            tossWinner: '',
            tossDecision: '',
            players: {}
          };
          for(var index in objTeam1){
            if(objTeam1[index].$id != undefined){
              if(objTeam1[index].$id == 'players'){
                for(var player in objTeam1[index]){
                  if(player != '$id'){
                    $scope.team1.players[player] = objTeam1[index][player];
                    if($scope.team1.players[player]){
                      $scope.team1.players[player]['ballsFaced'] = 0;
                      $scope.team1.players[player]['sixes'] = 0;
                      $scope.team1.players[player]['fours'] = 0;
                      $scope.team1.players[player]['runsGiven'] = 0;
                      $scope.team1.players[player]['wicketsTaken'] = 0;
                      $scope.team1.players[player]['widesGiven'] = 0;
                      $scope.team1.players[player]['noBallsGiven'] = 0;
                      $scope.team1.players[player]['ballsDelivered'] = 0;
                      $scope.team1.players[player]['runsScored'] = 0;
                    }
                  }
                }
              } else{
                $scope.team1[objTeam1[index].$id] = objTeam1[index].$value;
              }
            }
          }
        });

        $scope.refTeam2 = new Firebase(atob(fbServ.fbob)+"/teams/"+$scope.team2Ui);
        var objTeam2 = $firebaseArray($scope.refTeam2);
        objTeam2.$loaded().then(function(){
          $scope.team2 = {
            id: $scope.team2Ui,
            totalRunsScored: 0,
            totalBallsFaced: 0,
            totalBallsDelivered: 0,
            totalWicketsLost: 0,
            totalSixes: 0,
            totalFours: 0,
            wicketsTaken: 0,
            totalWides: 0,
            totalNoBalls: 0,
            tossWinner: '',
            tossDecision: '',
            players: {}
          };
          for(var index in objTeam2){
            if(objTeam2[index].$id != undefined){
              if(objTeam2[index].$id == 'players'){
                for(var player in objTeam2[index]){
                  if(player != '$id'){
                    $scope.team2.players[player] = objTeam2[index][player];
                    if($scope.team2.players[player]){
                      $scope.team2.players[player]['ballsFaced'] = 0;
                      $scope.team2.players[player]['sixes'] = 0;
                      $scope.team2.players[player]['fours'] = 0;
                      $scope.team2.players[player]['runsGiven'] = 0;
                      $scope.team2.players[player]['wicketsTaken'] = 0;
                      $scope.team2.players[player]['widesGiven'] = 0;
                      $scope.team2.players[player]['noBallsGiven'] = 0;
                      $scope.team2.players[player]['ballsDelivered'] = 0;
                      $scope.team2.players[player]['runsScored'] = 0;
                    }
                  }
                }
              } else{
                $scope.team2[objTeam2[index].$id] = objTeam2[index].$value;
              }
            }
          }

          $scope.fixtures.$add({
            matchNo: $scope.matchNoUi,
            matchTime: $scope.matchTimeUi,
            groundNo: $scope.groundNoUi,
            team1: $scope.team1,
            team2: $scope.team2,
            status: 'Yet to start',
            statusColor: 'blue'
          }).then(function(){
            console.log("Added fixture");
          });

        });
      }
    }
  })
  .filter('spaceless',function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '-');
        }
    }
  });
