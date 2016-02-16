angular.module('cutoff.controllers',[])

.controller('MainCtrl', function ($scope, $cordovaSQLite, $state, $ionicLoading) {

  $scope.caprounds = {
    title: "Which CAP Round?",
    options:[{
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
            }]
  }

  $scope.universities = {
    title: "Choose University",
    options: [
      {
        id: 'mumbai',
        name: 'Mumbai University'
      },
      {
        id: 'pune',
        name: 'Pune University'
      },
      {
        id: 'other',
        name: 'Other University'
      }
    ]
  }

  $scope.categories = {
    title: "Choose category",
    options: [
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
        name: 'NT1'
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
  }

  $scope.choice = {};
  $scope.choice.seatType = 'home';
  //testing
 /* $scope.choice.category = 'nt2';
  $scope.choice.rank = 100;*/

  $scope.setActive = function(type) {
    $scope.choice.seatType = type;
  };
  $scope.isActive = function(type) {
    return type === $scope.choice.seatType;
  };

  var colgIDs = [];
  $scope.getCollegeIDs = function() {
    console.log($scope.choice);
    var seat_type = $scope.choice.seatType;
    var category = $scope.choice.category.id;
    var ranka = $scope.choice.rank + 1000;
    var rankb = $scope.choice.rank - 1000;
    if(rankb <= 0)  rankb = 1;

    var university;
    if($scope.choice.university.id == 'other'){
      university = "university not in ('mumbai', 'pune')";
    }
    else{
      university = "university in ('"+$scope.choice.university.id+"')";
    }

    var query = "select college_id, rank from cutoffs_cutoff where seat_type=? and category=? and rank<=? and rank>=? order by rank desc ;";

    $ionicLoading.show({template:'Getting results..'});
    $cordovaSQLite.execute(db1, query, [seat_type,category,ranka,rankb]).then(function(res) {
      if(res.rows.length > 0) {
        colgIDs = [];
        for(var i = 0; i < res.rows.length; i++) {
          colgIDs.push(
            {
              colg_id: res.rows.item(i).college_id,
              rank: res.rows.item(i).rank
            });
        }
        $ionicLoading.hide();
        $state.go('tab.main-colleges', { colgIDs : colgIDs, university: university, rank: $scope.choice.rank});
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

.controller('CollegesCtrl', function ($scope, $stateParams, GetCollege, $state) {
  var colgIDs = $stateParams.colgIDs;
  var universityFilter = $stateParams.university;
  var rank = $stateParams.rank;
  $scope.safeColgs = [];
  $scope.ambitiousColgs = [];

  var len1 = colgIDs.length;
  var colg_ids = [];
  for(var i=0; i<len1; i++){
    colg_ids.push(colgIDs[i].colg_id);
  }
  colg_ids = '(' + colg_ids + ')';
  //console.log(colg_ids);
  console.log(colgIDs);
  console.log($scope);

  $scope.colleges = [];
  GetCollege.getByIDs(colg_ids, universityFilter).then(function(data){

    var len2 = data.length;
    for(var i=0; i<len1; i++){
      for(var j=0; j<len2; j++){
        if(colgIDs[i].colg_id == data[j].id ){
          data[j].rank = colgIDs[i].rank;
          break;
        }
      }
    }
    for(var i=0; i<len2; i++){
      if(data[i].rank <= rank)
        $scope.safeColgs.push(data[i]);
      else
        $scope.ambitiousColgs.push(data[i]);
    }
/*
    $scope.colleges = data;
    console.log('success');
    console.log($scope.colleges);*/
  });

  $scope.colgDetail = function (colgID) {
    $state.go('tab.main-col-details', {colgID: colgID});
  }
})

.controller('CollegeDetailCtrl', function ($scope, $stateParams, GetCollege) {
  var colgID = $stateParams.colgID;

  console.log(colgID);

  GetCollege.getByID(colgID).then(function(data){
    $scope.college = data[0];
  })



})

.controller('DocumentCtrl', function ($scope) {

})

.controller('SeatDistCtrl', function ($scope) {

})

.controller('InstituteCtrl', function ($scope) {

})

.controller('SyllabusCtrl', function ($scope, $cordovaFileOpener2, $cordovaActionSheet, $cordovaDialogs, $cordovaPinDialog, $cordovaSpinnerDialog, $cordovaToast) {

  /*$scope.files = [
    {
      name: "Direction_&_Syllabus_of_nagpur Uni(Tukdoji maharaj).pdf",
      type: "application/pdf"
    },
    {
      name: "Kolhapur Shivaji Uni Sylab.pdf",
      type: "application/pdf"
    },
    {
      name: "PuneUniMBASyllabusCOMPLETE.pdf",
      type: "application/pdf"
    },
    {
      name: "SylabusMMS Sem III & IV.pdf",
      type: "application/pdf"
    }
  ];

  $scope.openFile= function(file) {
    $cordovaFileOpener2.open(
      '/sdcard/cutoff/docs/'+file.name,
      file.type
    ).then(function() {
      console.log('Success');
    }, function(err) {
      console.log('An error occurred: ' + JSON.stringify(err));
    });
  };

  $scope.showActionSheet = function() {
    var options = {
      title: 'What do you want with this image?',
      buttonLabels: ['Share via Facebook', 'Share via Twitter'],
      addCancelButtonWithLabel: 'Cancel',
      androidEnableCancelButton : true,
      winphoneEnableCancelButton : true,
      addDestructiveButtonWithLabel : 'Delete it'
    };

    $cordovaActionSheet.show(options)
      .then(function(btnIndex) {
        var index = btnIndex;
      });
  };

  document.addEventListener("deviceready", function () {

    $scope.showActionSheet = function() {
      var options = {
        title: 'What do you want with this image?',
        buttonLabels: ['Share via Facebook', 'Share via Twitter'],
        addCancelButtonWithLabel: 'Cancel',
        androidEnableCancelButton : true,
        winphoneEnableCancelButton : true,
        addDestructiveButtonWithLabel : 'Delete it'
      };

      $cordovaActionSheet.show(options)
        .then(function(btnIndex) {
          var index = btnIndex;
        });
    };

    $scope.showDialog = function() {
      $cordovaDialogs.confirm('Do you like cats?', 'Question', ['Yes','No', 'Maybe'])
        .then(function(buttonIndex) {
          // no button = 0, 'OK' = 1, 'Cancel' = 2
          var btnIndex = buttonIndex;
          console.log(btnIndex);
        });
    };

    $scope.showPinDialog = function() {
      $cordovaPinDialog.prompt('Some message here').then(
        function(result) {
          console.log('Entered value : ' + result.input1);
        },
        function (error) {
          console.log('Error');
        });
    };

    $scope.showSpinnerDialog = function() {
      $cordovaSpinnerDialog.show("Warning","Self destruct imminent!", true);

      setTimeout(function(){
        $cordovaSpinnerDialog.hide();
      }, 3000);
    };

    $scope.showToast = function() {
      $cordovaToast
        .show("Here's a message", 'short', 'center')
        .then(function(success) {
          console.log('Success');
        }, function (error) {
          console.log('Error');
        });
    };

  }, false);
*/
});


