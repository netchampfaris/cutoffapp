angular.module('cutoff.controllers',[])

.controller('MainCtrl', function ($scope, $cordovaSQLite, $state, $ionicLoading) {

  $scope.caprounds = [
    {
      id: 1,
      name: 'CAP Round 1'
    },
    {
      id: 2,
      name: 'CAP Round 2'
    },
    {
      id: 3,
      name: 'CAP Round 3'
    }
  ]

  $scope.universities = [
    {
      id: 1,
      name: 'Mumbai University'
    },
    {
      id: 2,
      name: 'Pune University'
    },
    {
      id: 3,
      name: 'Other University'
    }
  ]

  $scope.categories = [
    {
      id: 'open',
      name: 'Open'
    },
    {
      id: 'sc',
      name: 'SC'
    },
    {
      id: 'vj',
      name: 'VJ'
    },
    {
      id: 'nt1',
      name: 'NT!'
    },
    {
      id: 'nt2',
      name: 'NT2'
    },
    {
      id: 'nt3',
      name: 'NT3'
    },
    {
      id: 'obc',
      name: 'OBC'
    },
    {
      id: 'st',
      name: 'ST'
    },
    {
      id: 'ai',
      name: 'AI'
    }
  ]
  $scope.choice = {};
  $scope.choice.seatType = 'home';


  $scope.setActive = function(type) {
    $scope.choice.seatType = type;
  };
  $scope.isActive = function(type) {
    return type === $scope.choice.seatType;
  };

  var colgIDs = [];

  $scope.getCollegeIDs = function() {
   // console.log($scope.choice);
    var seat_type = $scope.choice.seatType;
    var category = $scope.choice.category;
    var ranka = $scope.choice.rank + 1000;
    var rankb = $scope.choice.rank - 1000;

    var query = "select id from cutoffs_cutoff where seat_type=? and category=? and rank<=? and rank>=? order by rank desc ;";

    $ionicLoading.show({template:'Getting results..'});
    $cordovaSQLite.execute(db, query, [seat_type,category,ranka,rankb]).then(function(res) {
      if(res.rows.length > 0) {
        colgIDs = [];
        for(var i = 0; i < res.rows.length; i++) {
          colgIDs.push(res.rows.item(i).id);
        }
        $ionicLoading.hide();
        $state.go('tab.main-colleges', {colgIDs : colgIDs});
        //alert(JSON.stringify($scope.colgIDs));
      } else {
        console.log("No results found");
        $ionicLoading.hide();
        alert('No results found');
      }
    }, function (err) {
      console.error(err);
      $ionicLoading.hide();
    });
  }







})

.controller('CollegesCtrl', function ($scope, $stateParams, GetCollege) {
  var colgIDs = $stateParams.colgIDs;
  colgIDs = '(' + colgIDs + ')';
  console.log(colgIDs);

  $scope.colleges = [];
  GetCollege.getByIDs(colgIDs).then(function(data){
    $scope.colleges = data;
    console.log('success');
  });
})

.controller('DocumentCtrl', function ($scope) {

})

.controller('SeatDistCtrl', function ($scope) {

})

.controller('InstituteCtrl', function ($scope) {

})

.controller('UnknownCtrl', function ($scope) {

});


