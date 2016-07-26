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
  .module('bclLiveApp', ['ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .when('/teams', {
        templateUrl: 'views/teams.html',
        controller: 'teamCtrl'
      })
      .when('/teams/:name/players', {
        templateUrl: 'views/players.html',
        controller: 'playerCtrl'
      })
      .when('/fixtures', {
        templateUrl: 'views/fixtures.html',
        controller: 'fixtureCtrl'
      })
      .otherwise({
        templateUrl: '404.html'
      });
  });
