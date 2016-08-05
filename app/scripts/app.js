'use strict';

/**
 * @ngdoc overview
 * @name bclLiveApp
 * @description
 * # bclLiveApp
 *
 * Main module of the application.
 */
angular
  .module('bclLiveApp', ['ngRoute', 'firebase'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .when('/teams', {
        templateUrl: 'views/teams.html',
        controller: 'teamCtrl'
      })
      .when('/teams/:id/:name/players', {
        templateUrl: 'views/players.html',
        controller: 'playerCtrl'
      })
      .when('/fixtures', {
        templateUrl: 'views/fixtures.html',
        controller: 'fixtureCtrl'
      })
      .when('/scoring/fixture/:fixtureId/team1/:team1Id/:team1Name/team2/:team2Id/:team2Name', {
        templateUrl: 'views/scoring.html',
        controller: 'scoringCtrl'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'dashboardCtrl'
      })
      .when('/credits', {
        templateUrl: 'views/credits.html'
      })
      .otherwise({
        templateUrl: '404.html'
      });
  })
  .service('fbServ', function() {
    var _fb = 'YUhSMGNITTZMeTlpWTJ3dGJHbDJaUzF3Y205a0xtWnBjbVZpWVhObGFXOHVZMjl0';
    this.fbob = atob(_fb);
  })
