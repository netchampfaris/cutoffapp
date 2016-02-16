angular.module('cutoff.directives',[])

.directive('pickList', function ($ionicPopup) {

  var directive = {};

  directive.restrict = 'E';
  directive.template = '<div class="item">{{items.title}}<span class="item-note">{{model.name}} <span class="icon ion-chevron-down"></span></span></div>';

  directive.scope = {
    items: '=list',
    model: "=model",
    title: "=title"
  }

  directive.link = function(scope, elem, attrs) {
    elem.bind('click', function () {
      var title = attrs.heading;
      scope.popup = $ionicPopup.show({
        title: title,
        template: '<ion-radio ng-repeat="item in items.options" ng-value="item" ng-model="model" ng-change="onChangeModel(item)">{{item.name}}</ion-radio>',
        buttons: [{
          text: 'Ok'
        }],
        scope: scope
      });
    })

    scope.onChangeModel = function (item) {
      scope.popup.close();
      scope.model = item;
    }
  }

  return directive;
});
