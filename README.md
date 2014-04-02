qtSync
======

qtSync directive for Angular.js lets you sync the collection iterated by ng-repeat with other users/clients.

This example implements a chat room with minimal amounts of code.


```html
<ul>
    <li qt-sync="http://endpoint" ng-repeat="m in msgs">
        <span class="badge">{{m._user}}</span> {{m.text}}
    </li>
</ul>

<form ng-submit="sendMessage()">
    <input type="text" ng-model="messageText" placeholder="Type your message here" />
    <input type="submit" value="Send" />
    to
    <input type="text" ng-model="target" style="width:50px;" />
</form>
```

```javascript
function ChatCtrl($scope) {
    $scope.target = '*';
    $scope.sendMessage = function() {
        var msg = {text:$scope.messageText};
        if($scope.target && $scope.target.length) msg._target = $scope.target;
        $scope.msgs.push(msg);
        $scope.messageText = "";
    };
}
```
