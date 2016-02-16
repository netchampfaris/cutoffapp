// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var db1 = null, db2 = null, db3 = null;
angular.module('cutoff', ['ionic', 'cutoff.controllers','cutoff.services', 'cutoff.directives', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    var caproundDB = ['db.sqlite3'];  //add more dbs later

    window.plugins.sqlDB.copy('db.sqlite3', 0, function() {
      db1 = $cordovaSQLite.openDB('db.sqlite3');
    }, function(error) {
      console.error("There was an error copying the database: " + error);
      db1 = $cordovaSQLite.openDB('db.sqlite3');
    });

    asset2sd.copyDir({
        asset_directory: "www/docs",
        destination_directory: "cutoffapp/docs"
      },
      function() { console.log('success'); },
      function() { console.log('fail'); }
    );

  });
})

  .config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.main', {
        url: '/main',
        cache: false,
        views: {
          'tab-main': {
            templateUrl: 'templates/tab-main.html',
            controller: 'MainCtrl'
          }
        }
      })

      .state('tab.main-colleges', {
        url: '/main-colleges',
        params: {
          colgIDs: null,
          university: null,
          rank: null
        },
        views: {
          'tab-main': {
            templateUrl: 'templates/tab-main-colleges.html',
            controller: 'CollegesCtrl'
          }
        }
      })

      .state('tab.main-col-details', {
        url: '/main-col-details/:colgID',
        views: {
          'tab-main': {
            templateUrl: 'templates/tab-main-col-details.html',
            controller: 'CollegeDetailCtrl'
          }
        }
      })

      .state('tab.documents', {
        url: '/documents',
        views: {
          'tab-documents': {
            templateUrl: 'templates/tab-documents.html',
            controller: 'DocumentCtrl'
          }
        }
      })
      .state('tab.seatdist', {
        url: '/seatdist',
        views: {
          'tab-seatdist': {
            templateUrl: 'templates/tab-seatdist.html',
            controller: 'SeatDistCtrl'
          }
        }
      })

      .state('tab.institute', {
        url: '/institute',
        views: {
          'tab-institute': {
            templateUrl: 'templates/tab-institute.html',
            controller: 'InstituteCtrl'
          }
        }
      })

      .state('tab.syllabus', {
        url: '/syllabus',
        views: {
          'tab-syllabus': {
            templateUrl: 'templates/tab-syllabus.html',
            controller: 'SyllabusCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/main');

  });
