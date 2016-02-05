angular.module('itemService', [])

.factory('Item', function($http){
	
	// create a new object

	var itemFactory = {};

	//get all items

	itemFactory.all = function() {

		return $http.get('/search/all');

	};

	// create an item 

	itemFactory.singleItem = function(itemData) {

		return $http.post("/search/singleItem", itemData);

	};

	return itemFactory
});