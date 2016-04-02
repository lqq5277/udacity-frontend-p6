var favoriteLocations = [{
  name: "Westfield Valley Fair",
  position: {lat: 37.325739, lng: -121.945916}
}, {
  name: "City Sports",
  position: {lat: 37.349231, lng: -121.921128}
}, {
  name: "Library",
  position: {lat: 37.335436, lng: -121.884975}
}, {
  name: "Golf",
  position: {lat: 37.378352, lng: -121.891850}
}, {
  name: "Matrix Casion",
  position: {lat: 37.371216, lng: -121.919590}
}];

var map;
var markers = [];
function initMap() {
  var homeLatLng = {lat: 37.393283, lng: -121.903051};
  map = new google.maps.Map(document.getElementById('map'), {
    center: homeLatLng,
    zoom: 12
  });

  var marker = new google.maps.Marker({
    position: homeLatLng,
    map: map,
    title: 'Sweet Home!'
  });

  for (var location in favoriteLocations) {
    markers.push(new google.maps.Marker({
      position: favoriteLocations[location].position,
      map: map,
      title: favoriteLocations[location].name
    }));
  }
  setMapOnAll(map);
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

var Location = function(data) {
  this.name = ko.observable(data.name);
  this.position = ko.observable(data.position);
}

var ViewModel = function() {
  var self = this;
  this.locations = ko.observableArray([]);
  favoriteLocations.forEach(function(locationItem) {
    self.locations.push(new Location(locationItem));
  });

  this.showInfo = function(clickedLocation) {

  }

  this.filterPlaces = function() {

  }
}

window.addEventListener('load', initMap);

ko.applyBindings(new ViewModel());

