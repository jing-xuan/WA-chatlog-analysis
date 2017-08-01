var myapp = angular.module('myapp', []);

myapp.controller('MainCtrl', function ($scope) {
    $scope.showContent = function($fileContent){
        $scope.str = String($fileContent).match(/\d{2}\/\d{2}\/\d{4}[/,]\s\d{2}[/:]\d{2}\s[/-]\s[^:]*[/:]\s[^\n]*/gi);
        $scope.num = $scope.str.length;
        $scope.sdrs = [];
        $scope.msgs = [];
        $scope.data = [];
        $scope.sdrMsg = [];
        $scope.sdrData = [];
        var allDates = [];
        var msgPerDay = [];
        var msgLength = 0;
        var max = 0;
        for(var i = 0; i<$scope.num; i++){
          var date = $scope.str[i].slice(0,10);
          var parts = date.split("/");
          var dt = parts[1] + '/' + parts[0] + '/' + parts[2];
          var time = $scope.str[i].slice(12, 17);
          var rest = $scope.str[i].slice(20);
          var sender = String(rest).match(/[^:]*/);
          var msg = String(rest).slice(sender[0].length+2);
          var doc = {
            'date' : dt,
            'time' : time,
            'sender' : sender[0],
            'message' : msg
          };
          msgLength += msg.split(' ').length;
          $scope.data.push(doc);
          if(!$scope.sdrs.includes(sender[0])){
            $scope.sdrs.push(sender[0]);
            $scope.sdrMsg.push(0);
          }
          $scope.sdrMsg[$scope.sdrs.indexOf(sender[0])]++;
          if(!allDates.includes(dt)){
            allDates.push(dt);
            msgPerDay.push(0);
          };
          msgPerDay[allDates.indexOf(dt)]++;
        };
        $scope.cols = [];
        $scope.maxMsg = Math.max(...$scope.sdrMsg);
        for(var i = 0; i<$scope.sdrs.length; i++){
          $scope.sdrData.push([$scope.sdrs[i], $scope.sdrMsg[i]]);
          $scope.cols.push(($scope.sdrMsg[i]/$scope.maxMsg)*100);
        };
        $scope.senders = ($scope.sdrs.length);
        $scope.days = Math.floor((Date.parse($scope.data[$scope.num-1]['date'])-Date.parse($scope.data[0]['date']))/(24*60*60*1000));
        $scope.wordAvg = Math.floor(msgLength/$scope.num);
        $scope.msgAvg = Math.floor($scope.num/$scope.days);
        $scope.activeDay = allDates[msgPerDay.indexOf(Math.max(...msgPerDay))];
    };
  });

myapp.directive('onReadFile', function ($parse) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);

			element.on('change', function(onChangeEvent) {
				var reader = new FileReader();

				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						fn(scope, {$fileContent:onLoadEvent.target.result});
					});
				};

				reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
			});
		}
	};
});
