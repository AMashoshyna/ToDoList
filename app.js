(function() {
  'use strict';

  angular.module('myApp', [])
  .controller('AddItemController', AddItemController)
  .controller('DoneThingsController', DoneThingsController)
  .service('ListHandlerService', ListHandlerService)
  .factory('ListHandlerFactory', ListHandlerFactory)
  .directive('listItemDirective', ListItemDirective)
  .directive('toDoList', ToDoList)
  .directive('doneItemsList', DoneItemsList)


  function ListItemDirective() {
    var ddo = {
      templateUrl: 'listItem.html',
    }
    return ddo;
  };

  function ToDoList() {
    var ddo = {
      templateUrl: 'toDoList.html',
      scope: {
        ctrl: '=myCtrl',
        title: '@title'
      }
    };
    return ddo;
  };

  function DoneItemsList() {
    var ddo = {
      templateUrl: 'doneItemsList.html',
      scope:{
        ctrl: '=myCtrl',
        title: '@title'       
      }

    };
    return ddo;
  }

   AddItemController.$inject = ['ListHandlerService']
   function AddItemController(ListHandlerService, $scope) {
    var addItems = this;
    var service = ListHandlerService;
    addItems.items = service.getItems();
    var origTitle = 'ToDoList';
    addItems.getTitle = function() {
      return addItems.title;
    }
    addItems.title = origTitle + ' (' + addItems.items.length + ' items)';

    addItems.addItem = function(){
      if (addItems.thing.length == 0) {
        return;
      };
      service.addItem(addItems.thing);
      addItems.thing = '';
      addItems.warning = service.getWarning();
      addItems.title = origTitle + ' (' + addItems.items.length + ' items)';
    };

    addItems.clearList = function() {
      service.clearList();
      addItems.warning = service.getWarning();
      addItems.title = origTitle + ' (' + addItems.items.length + ' items)';
    };

    addItems.reduceList = function() {
      service.reduceList();
      addItems.warning = service.getWarning();
      addItems.title = origTitle + ' (' + addItems.items.length + ' items)';
    };
    
    addItems.removeItem = function(index) {
      service.removeItem(index);
      addItems.title = origTitle + ' (' + addItems.items.length + ' items)';
    };

    addItems.doThing = function(index) {
      service.doThing(index);
      addItems.title = origTitle + ' (' + addItems.items.length + ' items)';
    }
  };
  
  DoneThingsController.$inject = ['ListHandlerService'];
  function DoneThingsController(ListHandlerService) {
    var doneThings = this;
    var service = ListHandlerService;
    doneThings.items = service.getDoneItems();
    var origTitle = 'Done ';
    doneThings.title = origTitle + ' (' + doneThings.items.length + ' items)';
    // doneThings.getTitle = function() {
    //   return title;
    // }
  }
    
  function ListHandlerService() {
    var service = this;
    var itemList = [];
    var doneItems = [];
    var warning = "1";
    var listLimit = 5;
    
    service.addItem = function(item) {
      if (item.length == 0) {
        return;
      }
      itemList.push(item)
      if (itemList.length > 5) {
        warning = `Too many items on your list! Recommended number of items is 5.`
      } else {
        warning = "";
      }
    };
    
    service.removeItem = function(index) {
      itemList.splice(index, 1);
    };

    service.doThing = function(index) {
      var doneThing = itemList.splice(index, 1);
      doneItems.push(doneThing[0]);
    }
    
    service.getItems = function() {
      return itemList;
    };

    service.getDoneItems = function() {
      return doneItems;
    } 

    service.getWarning = function() {
      return warning;
    };
    
    service.clearList = function() {
      itemList.splice(0, itemList.length)
      warning = "";
    };
    service.reduceList = function(max) {
      var limit = max || listLimit;
      var surplus = itemList.length - limit;
      for (var i = 0; i < surplus; i++) {
        var randomTaskNumber = Math.floor(Math.random() * itemList.length);
        itemList.splice(randomTaskNumber,1);
      }
      warning = "";
    }
  };

  function ListHandlerFactory() {
    var factory = function(maxItems) {
      return new ListHandlerService(maxItems);
    };
    return factory;
  }
})();