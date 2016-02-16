angular.module('cutoff.services', [])

  .factory('GetCollege', function($cordovaSQLite, $q) {

    var colleges = [];


    return {
      all: function() {
        var defer = $q.defer();
        var query = "select * from cutoffs_college";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
          if(res.rows.length > 0) {
            colleges = [];
            for(var i = 0; i < res.rows.length; i++) {
              colleges.push(res.rows.item(i));
            }
            defer.resolve(colleges);
          } else {
            console.log("No results found");
            colleges = [];
            defer.resolve(colleges);
          }
        }, function (err) {
          console.error(err);
          defer.reject();
        });
        return defer.promise;
      },
      getByIDs: function(colgIDs, universityFilter) {
        var defer = $q.defer();

        var query = "select * from cutoffs_college where id in "+ colgIDs +" and "+ universityFilter +";";

        console.log(query);
        $cordovaSQLite.execute(db1, query, []).then(function(res) {
          if(res.rows.length > 0) {
            colleges = [];
            for(var i = 0; i < res.rows.length; i++) {
              colleges.push(res.rows.item(i));
            }
            defer.resolve(colleges);
          } else {
            console.log("No results found");
            colleges = [];
            defer.resolve(colleges);
          }
        }, function (err) {
          console.error(err);
          defer.reject();
        });
        return defer.promise;
      },
      getByID: function (colgID) {
        var defer = $q.defer();

        var query = "select * from cutoffs_college where id=? ;";

        $cordovaSQLite.execute(db1, query, [colgID]).then(function(res) {
          if(res.rows.length > 0) {
            colleges = [];
            for(var i = 0; i < res.rows.length; i++) {
              colleges.push(res.rows.item(i));
            }
            console.log(colleges);
            defer.resolve(colleges);
          } else {
            console.log("No results found");
            colleges = [];
            defer.resolve(colleges);
          }
        }, function (err) {
          console.error(err);
          defer.reject();
        });
        return defer.promise;
      }
    };
  });
