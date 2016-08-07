'use strict';

/**
 * @ngdoc function
 * @name bclLiveApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the bclLiveApp
 */
angular.module('bclLiveApp')
  .controller('dashboardCtrl', function($scope, $firebaseObject, $firebaseArray, fbServ){
    $scope.refDashboard = new Firebase(atob(fbServ.fbob)+'/dashboard');
    var obj = $firebaseObject($scope.refDashboard);
    obj.$bindTo($scope, 'dashboard').then(function(){

      $scope.refFB = new Firebase(atob(fbServ.fbob)+"/fixtures");
      var arr = $firebaseArray($scope.refFB);

      $scope.getTotalRuns = function(){
        var totalRuns = 0;
        for(var i in arr){
          if(arr[i]['team1'] || arr[i]['team2']){
            if(arr[i].team1.totalRunsScored){
              totalRuns += arr[i].team1.totalRunsScored;
            }
            if(arr[i].team2.totalRunsScored){
              totalRuns += arr[i].team2.totalRunsScored;
            }
          }
        }
        return totalRuns;
      }

      $scope.getTotalWickets = function(){
        var totalWickets = 0;
        for(var i in arr){
          if(arr[i]['team1'] || arr[i]['team2']){
            if(arr[i].team1.totalWicketsLost){
              totalWickets += arr[i].team1.totalWicketsLost;
            }
            if(arr[i].team2.totalWicketsLost){
              totalWickets += arr[i].team2.totalWicketsLost;
            }
          }
        }
        return totalWickets;
      }

      $scope.getTotalFours = function(){
        var totalFours = 0;
        for(var i in arr){
          if(arr[i]['team1'] || arr[i]['team2']){
            if(arr[i].team1.totalFours){
              totalFours += arr[i].team1.totalFours;
            }
            if(arr[i].team2.totalFours){
              totalFours += arr[i].team2.totalFours;
            }
          }
        }
        return totalFours;
      }

      $scope.getTotalSixes = function(){
        var totalSixes = 0;
        for(var i in arr){
          if(arr[i]['team1'] || arr[i]['team2']){
            if(arr[i].team1.totalSixes){
              totalSixes += arr[i].team1.totalSixes;
            }
            if(arr[i].team2.totalSixes){
              totalSixes += arr[i].team2.totalSixes;
            }
          }
        }
        return totalSixes;
      }

    });
  });
