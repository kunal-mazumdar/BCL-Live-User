angular.module('bclLiveApp')
  .controller('scoringCtrl', function ($scope, $routeParams, $firebaseArray, $firebaseObject, $window, fbServ) {
    $scope.fixtureId = $routeParams.fixtureId;
    $scope.team1Name = $routeParams.team1Name;
    $scope.team2Name = $routeParams.team2Name;
    $scope.team1Id = $routeParams.team1Id;
    $scope.team2Id = $routeParams.team2Id;

    fixtureServices('getTossStatus', '', 'tossWinnerTeamUi', 'tossDecisionUi');
    bindTeamScore();

    $scope.onChange = function(){
      if($scope.tossWinnerTeamUi && $scope.tossDecisionUi){
        $scope.teams = ['team1', 'team2'];
        $scope.actName = [$scope.team1Name, $scope.team2Name];

        $scope.selectedTeam = $scope.actName[$scope.teams.indexOf($scope.tossWinnerTeamUi)];
        $scope.teams.splice($scope.teams.indexOf($scope.tossWinnerTeamUi), 1);
        $scope.actName.splice($scope.actName.indexOf($scope.selectedTeam), 1);
        $scope.notSelectedTeam = $scope.actName[0];
        $scope.tossLoserTeam = $scope.teams[0];

        if($scope.tossDecisionUi == 'BAT'){
          $scope.firstBattingTeamName = $scope.secondFieldingTeamName = $scope.selectedTeam;
          $scope.firstFieldingTeamName = $scope.secondBattingTeamName = $scope.notSelectedTeam;

          $scope.firstBattingTeamNo = $scope.secondFieldingTeamNo = $scope.tossWinnerTeamUi;
          $scope.firstFieldingTeamNo = $scope.secondBattingTeamNo = $scope.teams[0];

          //bindTeamScore($scope.firstBattingTeamNo, $scope.secondBattingTeamNo);

        } else{
          $scope.dataLoaded = false;
          $scope.firstBattingTeamName = $scope.secondFieldingTeamName = $scope.notSelectedTeam;
          $scope.firstFieldingTeamName = $scope.secondBattingTeamName = $scope.selectedTeam;

          $scope.firstBattingTeamNo = $scope.secondFieldingTeamNo = $scope.teams[0];
          $scope.firstFieldingTeamNo = $scope.secondBattingTeamNo = $scope.tossWinnerTeamUi;

          //bindTeamScore($scope.firstBattingTeamNo, $scope.secondBattingTeamNo);
        }
      }
      fixtureServices('updateTossStatus', '', '');
    }

    function getTeamPlayers(teamIdentifier, variable1, variable2){
      $scope.refFixture = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId+"/"+teamIdentifier+"/players");
      var obj = $firebaseArray($scope.refFixture);
      obj.$loaded().then(function(){
        $scope[variable1] = obj;
        $scope[variable2] = obj;
      });
    }

    function bindTeamScore(firstBattingTeamNo, secondBattingTeamNo){
      var refTeam1 = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId);
      var objT1 = $firebaseObject(refTeam1);
      objT1.$bindTo($scope, 'data').then(function(){
        console.log($scope.data);
      });
    }

    function fixtureServices(serviceIdentifier, teamIdentifier, variable1, variable2){
      $scope.refFixture = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId);
      var obj = $firebaseArray($scope.refFixture);
      obj.$loaded().then(function(){
        console.log(obj);

        // Get the team batting score, take teamIdentifier and update variable1
        if(serviceIdentifier == 'getScore'){
          for(index in obj){
            if(obj[index].$id == teamIdentifier){
              $scope[variable1] = obj[index].totalRunsScored;
              $scope[variable2] = obj[index].totalWicketsLost;
              break;
            }
          }
        }

        if(serviceIdentifier == 'getTossStatus'){
          for(index in obj){
            if(obj[index].$id == 'status'){
              $scope.fixtureStatus = obj[index].$value;
            }
            if(obj[index].$id == 'statusColor'){
              $scope.fixtureStatusColor = obj[index].$value;
            }
            if(obj[index].$id == 'team1'){
              if(obj[index].tossWinner == 'yes'){
                  $scope[variable1] = 'team1';
                  $scope[variable2] = obj[index].tossDecision;
                  break;
              }
            }
            if(obj[index].$id == 'team2'){
              if(obj[index].tossWinner == 'yes'){
                  $scope[variable1] = 'team2';
                  $scope[variable2] = obj[index].tossDecision;
                  break;
              }
            }
          }
          $scope.onChange();
          $scope.scoreLoaded = true;
        }

        if(serviceIdentifier == 'updateTossStatus'){
          for(index in obj){
            if(obj[index].$id == 'status'){
              obj[index].$value = $scope.fixtureStatus;
              obj.$save(obj[index]);
            }
            if(obj[index].$id == 'team1'){
              if($scope.tossWinnerTeamUi == 'team1'){
                obj[index].tossWinner = 'yes';
                obj[index].tossDecision = $scope.tossDecisionUi != undefined ? $scope.tossDecisionUi : '';
              } else{
                obj[index].tossWinner = '';
                obj[index].tossDecision = '';
              }
              obj.$save(obj[index]);
            }
            if(obj[index].$id == 'team2'){
              if($scope.tossWinnerTeamUi == 'team2'){
                if($scope.tossWinnerTeamUi == 'team2'){
                  obj[index].tossWinner = 'yes';
                  obj[index].tossDecision = $scope.tossDecisionUi != undefined ? $scope.tossDecisionUi : '';
                } else{
                  obj[index].tossWinner = '';
                  obj[index].tossDecision = '';
                }
                obj.$save(obj[index]);
              }
            }
          }
        }

      });
    }


      $scope.updateRunScore = function(type, playerId, count, teamIdentifier){
        console.log('updateRunScore => ', type, " $$ ", playerId, " $$ ", count, " $$ ", teamIdentifier);
        $scope.refPlayer = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId+"/"+teamIdentifier+"/players/"+playerId);
        var obj = $firebaseArray($scope.refPlayer);
        obj.$loaded().then(function(){
          for(var index in obj){
            // Updating runs scored
            if(obj[index].$id == 'runsScored'){
              if(type == 'incr'){
                if(count){
                  obj[index].$value += count;
                } else{
                  obj[index].$value += 1;
                }
              } else if(type == 'decr'){
                if(count && obj[index].$value >= count){
                  obj[index].$value -= count;
                } else{
                  if(obj[index].$value > 0){
                    obj[index].$value -= 1;
                  }
                }
              }
              obj.$save(obj[index]);
            }
          }
          $scope.updateTeamScore();
        });
      }

      $scope.updateFours = function(type, playerId, teamIdentifier){
        $scope.refPlayer = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId+"/"+teamIdentifier+"/players/"+playerId);
        var obj = $firebaseArray($scope.refPlayer);
        var isFourUpdated = false;
        obj.$loaded().then(function(){
          for(var index in obj){
            // Updating 4s
            if(obj[index].$id == 'fours'){
              if(type == 'incr'){
                obj[index].$value += 1;
                isFourUpdated = true;
              } else if(type == 'decr'){
                if(obj[index].$value > 0){
                  obj[index].$value -= 1;
                  isFourUpdated = true;
                }
              }
              obj.$save(obj[index]).then(function(){
                if(isFourUpdated){
                  // Updating player runs
                  $scope.updateRunScore(type, playerId, 4, teamIdentifier);

                  // Updating team total sixes
                  $scope.refTeam = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId+"/"+teamIdentifier);
                  var objTeam = $firebaseArray($scope.refTeam);
                  objTeam.$loaded().then(function(){
                    for(var i in objTeam){
                      if(objTeam[i].$id == 'totalFours'){
                        if(type == 'incr'){
                          objTeam[i].$value += 1;
                        } else if(type == 'decr'){
                          if(objTeam[i].$value > 0){
                            objTeam[i].$value -= 1;
                          }
                        }
                        objTeam.$save(objTeam[i]);
                      }
                    }
                  });

                }
              });
            }
          }
        });
      }

      $scope.updateSixes = function(type, playerId, teamIdentifier){
        $scope.refPlayer = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId+"/"+teamIdentifier+"/players/"+playerId);
        var obj = $firebaseArray($scope.refPlayer);
        var isSixUpdated = false;
        obj.$loaded().then(function(){
          for(var index in obj){
            // Updating 6s
            if(obj[index].$id == 'sixes'){
              if(type == 'incr'){
                obj[index].$value += 1;
                isSixUpdated = true;
              } else if(type == 'decr'){
                if(obj[index].$value > 0){
                  obj[index].$value -= 1;
                  isSixUpdated = true;
                }
              }
              obj.$save(obj[index]).then(function(){
                if(isSixUpdated){
                  // Updating player runs
                  $scope.updateRunScore(type, playerId, 6, teamIdentifier);

                  // Updating team total sixes
                  $scope.refTeam = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId+"/"+teamIdentifier);
                  var objTeam = $firebaseArray($scope.refTeam);
                  objTeam.$loaded().then(function(){
                    for(var i in objTeam){
                      if(objTeam[i].$id == 'totalSixes'){
                        if(type == 'incr'){
                          objTeam[i].$value += 1;
                        } else if(type == 'decr'){
                          if(objTeam[i].$value > 0){
                            objTeam[i].$value -= 1;
                          }
                        }
                        objTeam.$save(objTeam[i]);
                      }
                    }
                  });

                }
              });
              break;
            }
          }
        });
      }

      $scope.updateBallsFaced = function(type, playerId, teamIdentifier){
        $scope.refPlayer = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId+"/"+teamIdentifier+"/players/"+playerId);
        var obj = $firebaseArray($scope.refPlayer);
        obj.$loaded().then(function(){
          for(var index in obj){
            if(obj[index].$id == 'ballsFaced'){
              if(type == 'incr'){
                obj[index].$value += 1;
              } else if(type == 'decr'){
                if(obj[index].$value > 0){
                  obj[index].$value -= 1;
                }
              }
              obj.$save(obj[index]);
            }
          }
        });
      }

      /* Bowling Side */
      $scope.updateBallsDelivered = function(type, playerId, teamIdentifier){
        $scope.refPlayer = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId+"/"+teamIdentifier+"/players/"+playerId);
        var obj = $firebaseArray($scope.refPlayer);
        obj.$loaded().then(function(){
          for(var index in obj){
            if(obj[index].$id == 'ballsDelivered'){
              if(type == 'incr'){
                obj[index].$value += 1;
              } else if(type == 'decr'){
                if(obj[index].$value > 0){
                  obj[index].$value -= 1;
                }
              }
              obj.$save(obj[index]).then(function(){
                $scope.refTeam = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId+"/"+teamIdentifier);
                var objTeam = $firebaseArray($scope.refTeam);
                objTeam.$loaded().then(function(){
                  for(var i in objTeam){
                    if(objTeam[i].$id == 'totalBallsDelivered'){
                      if(type == 'incr'){
                        objTeam[i].$value += 1;
                      } else if(type == 'decr'){
                        if(objTeam[i].$value > 0){
                          objTeam[i].$value -= 1;
                        }
                      }
                      objTeam.$save(objTeam[i]);
                      break;
                    }
                  }
                });
              });
              break;
            }
          }
        });
      }

      $scope.updateRunsGiven = function(type, playerId, count, teamIdentifier){
        $scope.refPlayer = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId+"/"+teamIdentifier+"/players/"+playerId);
        var obj = $firebaseArray($scope.refPlayer);
        obj.$loaded().then(function(){
          for(var index in obj){
            // Updating runs scored
            if(obj[index].$id == 'runsGiven'){
              if(type == 'incr'){
                if(count){
                  obj[index].$value += count;
                } else{
                  obj[index].$value += 1;
                }
              } else if(type == 'decr'){
                if(count && obj[index].$value >= count){
                  obj[index].$value -= count;
                } else{
                  if(obj[index].$value > 0){
                    obj[index].$value -= 1;
                  }
                }
              }
              obj.$save(obj[index]);
            }
          }
          $scope.updateTeamScore();
        });
      }

      $scope.updateWicketsTaken = function(type, playerId, teamIdentifier){
        $scope.refPlayer = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId+"/"+teamIdentifier+"/players/"+playerId);
        var obj = $firebaseArray($scope.refPlayer);
        obj.$loaded().then(function(){
          for(var index in obj){
            if(obj[index].$id == 'wicketsTaken'){
              if(type == 'incr'){
                obj[index].$value += 1;
              } else if(type == 'decr'){
                if(obj[index].$value > 0){
                  obj[index].$value -= 1;
                }
              }
              obj.$save(obj[index]);
            }
          }
          $scope.updateTeamScore();
        });
      }

      $scope.updateNoBallsGiven = function(type, playerId, teamIdentifier){
        $scope.refPlayer = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId+"/"+teamIdentifier+"/players/"+playerId);
        var obj = $firebaseArray($scope.refPlayer);
        obj.$loaded().then(function(){
          for(var index in obj){
            if(obj[index].$id == 'noBallsGiven'){
              if(type == 'incr'){
                obj[index].$value += 1;
              } else if(type == 'decr'){
                if(obj[index].$value > 0){
                  obj[index].$value -= 1;
                }
              }
              obj.$save(obj[index]).then(function(){
                $scope.refTeam = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId+"/"+teamIdentifier);
                var objTeam = $firebaseArray($scope.refTeam);
                objTeam.$loaded().then(function(){
                  for(var i in objTeam){
                    if(objTeam[i].$id == 'totalNoBalls'){
                      if(type == 'incr'){
                        objTeam[i].$value += 1;
                      } else if(type == 'decr'){
                        if(objTeam[i].$value > 0){
                          objTeam[i].$value -= 1;
                        }
                      }
                      objTeam.$save(objTeam[i]);
                      break;
                    }
                  }
                });

              });
            }
          }
          $scope.updateTeamScore();
        });
      }

      $scope.updateWideBallsGiven = function(type, playerId, teamIdentifier){
        $scope.refPlayer = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId+"/"+teamIdentifier+"/players/"+playerId);
        var obj = $firebaseArray($scope.refPlayer);
        obj.$loaded().then(function(){
          for(var index in obj){
            if(obj[index].$id == 'widesGiven'){
              if(type == 'incr'){
                obj[index].$value += 1;
              } else if(type == 'decr'){
                if(obj[index].$value > 0){
                  obj[index].$value -= 1;
                }
              }
              obj.$save(obj[index]).then(function(){
                $scope.refTeam = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId+"/"+teamIdentifier);
                var objTeam = $firebaseArray($scope.refTeam);
                objTeam.$loaded().then(function(){
                  for(var i in objTeam){
                    if(objTeam[i].$id == 'totalWides'){
                      if(type == 'incr'){
                        objTeam[i].$value += 1;
                      } else if(type == 'decr'){
                        if(objTeam[i].$value > 0){
                          objTeam[i].$value -= 1;
                        }
                      }
                      objTeam.$save(objTeam[i]);
                      break;
                    }
                  }
                });

              });
            }
          }
          $scope.updateTeamScore();
        });
      }

      $scope.updateTeamScore = function(){
        $scope.refFixture = new Firebase(atob(fbServ.fbob)+"/fixtures/"+$scope.fixtureId);
        var obj = $firebaseObject($scope.refFixture);
        obj.$loaded().then(function(){
          console.log('obj as obj -> ', obj);
          var team1TotalRunsScored = 0;
          var team2TotalRunsScored = 0;
          for(var player in obj.team1.players){
            team1TotalRunsScored += obj.team1.players[player].runsScored;
            team2TotalRunsScored += obj.team1.players[player].noBallsGiven;
            team2TotalRunsScored += obj.team1.players[player].widesGiven;
          }
          for(var player in obj.team2.players){
            team2TotalRunsScored += obj.team2.players[player].runsScored;
            team1TotalRunsScored += obj.team2.players[player].noBallsGiven;
            team1TotalRunsScored += obj.team2.players[player].widesGiven;
          }
          obj.team1.totalRunsScored = team1TotalRunsScored;
          obj.team2.totalRunsScored = team2TotalRunsScored;
          obj.$save();
        });
      }
  })
  .filter('parse', function() {
    return function(input) {
       return parseInt(input, 10);
    }
  });
