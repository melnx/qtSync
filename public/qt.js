//var sock;
var qtSockets = {};

function bindArrayToEndpoint($scope, name, endpoint){
  var sock = qtSockets[endpoint];

  if(!sock){
    qtSockets[endpoint] = sock = new SockJS(endpoint);
  }

  if(!name) name = "qtMessages";

  $scope[name] = [];

  sock.onmessage = function(e) {
    if(e.type == "message"){
      var parsed = JSON.parse(e.data);
      for(key in parsed){
        e[key] = parsed[key];
      }
      delete e.data;
      delete e.type;

      console.log(e);

      e.__qt = 1;
      $scope[name].push(e);
      $scope.$apply();
    }else{
      alert("unknown message type");
    }
  };

  $scope.$watchCollection(name, function(newValues, oldValues) {
    angular.forEach(newValues, function(value){
      if(typeof(value) != 'object'){
        $scope[name].splice($scope[name].indexOf(value),1);
        throw "Not supported item type: '" + typeof(value) + "', please use an object.";
      }else{
        if(!value.__qt){
          $scope[name].splice($scope[name].indexOf(value),1);
          sock.send(JSON.stringify(value));
        }
      }
    });
  });
}

angular.module("ng").directive("qtSync", ['$parse', '$animate', function($parse, $animate) {
  return {
    priority: 1000,
    link: function($scope, $element, $attr, ctrl, $transclude){
      var expression = $attr.ngRepeat;
      var endpoint = $attr.qtSync;
      var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),
        trackByExp, trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn,
        lhs, rhs, valueIdentifier, keyIdentifier;

      if (!match) {
        throw 'invalid ng-repeat value';
      }

      lhs = match[1];
      rhs = match[2];
      trackByExp = match[3];

      bindArrayToEndpoint($scope, rhs, endpoint);
    }
  }
}]);
