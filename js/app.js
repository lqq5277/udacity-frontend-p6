"use strict";
var placesDatabase = [{
  name: "Westfield Valley Fair",
  position: {lat: 37.325739, lng: -121.945916},
  address: "2855 Stevens Creek Blvd, Santa Clara, CA 95050"
}, {
  name: "City Sports Club",
  position: {lat: 37.349231, lng: -121.921128},
  address:"610 Newhall Dr, San Jose, CA 95110"
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
  name: "Santa Clara Golf and Tennis Club",
  position: {lat: 37.406211, lng: -121.971746},
  address: "5155 Stars and Stripes Dr, Santa Clara, CA 95054"
}, {
  name: "99 Ranch Market",
  position: {lat: 37.422845, lng: -121.916828},
  address: "338 Barber Ln, Milpitas, CA 95035"
}];

var map;
var places = [];
var infowindow;

function initMap() {
  var centerLatLng = {lat: 37.393283, lng: -121.903051};
  map = new google.maps.Map(document.getElementById('map'), {
    center: centerLatLng,
    zoom: 12
  });
  places.forEach(function(place) {
    place.marker = new google.maps.Marker({
      position: place.position(),
      map: map,
      title: place.name()
    });
    place.marker.addListener('click', (function(placeCopy) {
      return function() {
        placeCopy.animateMarker();
        placeCopy.setInfowindow();
        infowindow.open(map, placeCopy.marker);
      };
    })(place));
  });
  infowindow = new google.maps.InfoWindow({maxWidth: 300});
}

function googleError() {
// I can't find a way to make this work
//  this.googleError('There is problem to retrieve data from google map</br>Please try again later');
  $('#google-error').html('<h5>There is problem to retrieve data from google map</br>Please try again later</h5>');
  //this.showingPlaces([]);
}

var Place = function(data) {
  this.name = ko.observable(data.name);
  this.position = ko.observable(data.position);
  this.address = ko.observable(data.address);
};
Place.prototype.setInfowindow = function() {
  var foursqureUrl = 'https://api.foursquare.com/v2/venues/search?' + '&client_id=WFIMC5SVQAC40JYK2WROVKCE401OZJPP1DHRBGIPLCCDLWML' + '&client_secret= 2E1ZBQ01OCXK21H02J44AIK0KXN5YZ1Y5GM0OORQULFR5KVF' + '&v=20160405' + '&ll=' + this.position().lat + ',' + this.position().lng;
  var lowcaseName = this.name().toLowerCase();
  var found = false;
  $.getJSON(foursqureUrl, function(data) {
    var venues = data.response.venues;
    for(var i in venues) {
      if (venues[i].name.toLowerCase().includes(lowcaseName)) {
        var contentString = '<div class="placeInfoWindow">' + '<div class="placeName">' + venues[i].name + '</div>' + '<div class="venueCheckins">' + venues[i].stats.checkinsCount + ' people has checked in on foursquare' + '</span>' + '<div class="venueContact">phone:' + venues[i].contact.formattedPhone + '</div>' + '</div>';
        infowindow.setContent(contentString);
        found = true;
        break;
      }
    }
    if (!found) {
      infowindow.setContent('<h4>Can\'t find it on foursquare</h4>');
    }
  }).error(function() {
    infowindow.setContent('<h4>There is problem to retrieve data</br>Please try again later</h4>');
  });
};
Place.prototype.animateMarker = function() {
  var self = this;
  this.marker.setAnimation(google.maps.Animation.DROP);
  // On my machine, if I uncomment following line, then there is no any animation at all
  //setTimeout(self.marker.setAnimation(null), 2800);
};
Place.prototype.setMap = function(map) {
  this.marker.setMap(map);
};

var ViewModel = function() {
  var self = this;
//  this.googleError = ko.observable('');
  this.showingPlaces = ko.observableArray([]);
  placesDatabase.forEach(function(placeItem) {
    var place = new Place(placeItem);
    places.push(place);
    self.showingPlaces.push(place);
  });
  this.filterString = ko.observable('');
  this.showInfo = function(clickedPlace) {
    map.panTo(clickedPlace.position());
    map.setZoom(14);
    clickedPlace.animateMarker();
    clickedPlace.setInfowindow();
    infowindow.open(map, clickedPlace.marker);
  };
  this.filterPlaces = function() {
    var filterKeyword = self.filterString().toLowerCase();
    self.showingPlaces([]);
    places.forEach(function(place) {
      if (place.name().toLowerCase().includes(filterKeyword)) {
        self.showingPlaces.push(place);
        place.setMap(map);
      } else {
        place.setMap(null);
      }
    });
  };
};

ko.applyBindings(new ViewModel());
