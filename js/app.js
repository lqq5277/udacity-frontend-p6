var favoritePlaces = [{
  name: "Westfield Valley Fair",
  position: {lat: 37.325739, lng: -121.945916},
  address: "2855 Stevens Creek Blvd, Santa Clara, CA 95050"
}, {
  name: "City Sports Club",
  position: {lat: 37.349231, lng: -121.921128},
  address:"610 Newhall Dr, San Jose, CA 95110"
}, {
  name: "City Sports Club",
  position: {lat: 37.383839, lng: -121.898053},
  address:"1045 E Brokaw Rd, San Jose, CA 95131"
}, {
  name: "Dr. Martin Luther King, Jr. Library",
  position: {lat: 37.335436, lng: -121.884975},
  address: "150 E San Fernando St, San Jose, CA 95112"
}, {
  name: "Northside Branch Library",
  position: {lat: 37.395717, lng: -121.946975},
  address: "695 Moreland Way, Santa Clara, CA 95054"
}, {
  name: "San Jose Municipal Golf Course",
  position: {lat: 37.378352, lng: -121.891850},
  address: "1560 Oakland Rd, San Jose, CA 95131"
}, {
  name: "Santa Clara Golf & Tennis Club",
  position: {lat: 37.406211, lng: -121.971746},
  address: "5155 Stars and Stripes Dr, Santa Clara, CA 95054"
}, {
  name: "99 Ranch Market",
  position: {lat: 37.422845, lng: -121.916828},
  address: "338 Barber Ln, Milpitas, CA 95035"
}, {
  name: "99 Ranch Market",
  position: {lat: 37.386385, lng: -121.884403},
  address: "1688 Hostetter Rd, San Jose, CA 95131"
}];

var map;
var markers = [];
function initMap() {
  var centerLatLng = {lat: 37.393283, lng: -121.903051};
  map = new google.maps.Map(document.getElementById('map'), {
    center: centerLatLng,
    zoom: 12
  });

  for (var place in favoritePlaces) {
    markers.push(new google.maps.Marker({
      position: favoritePlaces[place].position,
      map: map,
      title: favoritePlaces[place].name
    }));
  }
  setMapOnAll(map);
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

var Place = function(data) {
  this.name = ko.observable(data.name);
  this.position = ko.observable(data.position);
  this.address = ko.observable(data.address);
}

var ViewModel = function() {
  var self = this;
  this.showingPlaces = ko.observableArray([]);
  favoritePlaces.forEach(function(placeItem) {
    self.showingPlaces.push(new Place(placeItem));
  });

  this.filterString = ko.observable('');

  this.showInfo = function(clickedPlace) {

  };

  this.filterPlaces = function() {
    var filterKeyword = self.filterString().toLowerCase();
    self.showingPlaces([]);
    setMapOnAll(null);
    markers = [];
    for (var place in favoritePlaces) {
      if (favoritePlaces[place].name.toLowerCase().includes(filterKeyword)) {
        self.showingPlaces.push(new Place(favoritePlaces[place]));
        markers.push(new google.maps.Marker({
          position: favoritePlaces[place].position,
          map: map,
          title: favoritePlaces[place].name
        }));
      }
    }

  };
}

window.addEventListener('load', initMap);

ko.applyBindings(new ViewModel());
