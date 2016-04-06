var favoritePlaces = [{
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
var markers = [];
var infowindow;

function initMap() {
  var centerLatLng = {lat: 37.393283, lng: -121.903051};
  map = new google.maps.Map(document.getElementById('map'), {
    center: centerLatLng,
    zoom: 12
  });

  for (var place in favoritePlaces) {
    var marker = new google.maps.Marker({
      position: favoritePlaces[place].position,
      map: map,
      title: favoritePlaces[place].name
    });
    marker.addListener('click', (function(placeCopy, markerCopy) {
      return function() {
        setInfowindow(favoritePlaces[placeCopy]);
        //infowindow.setContent(favoritePlaces[placeCopy].address);
        infowindow.open(map, markerCopy);
      };
    })(place, marker));
    markers.push(marker);
  }
  setMapOnAll(map);
  infowindow = new google.maps.InfoWindow({maxWidth: 300});
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

function setInfowindow(place) {
  var foursqureUrl = 'https://api.foursquare.com/v2/venues/search?' + '&client_id=WFIMC5SVQAC40JYK2WROVKCE401OZJPP1DHRBGIPLCCDLWML' + '&client_secret= 2E1ZBQ01OCXK21H02J44AIK0KXN5YZ1Y5GM0OORQULFR5KVF' + '&v=20160405' + '&ll=' + place.position.lat + ',' + place.position.lng;
  console.log(foursqureUrl);
  $.getJSON(foursqureUrl, function(data) {
    var places = data.response.venues;
    for (var i = 0; i < places.length; i++) {
      var item = places[i];
      var lowcaseName = place.name.toLowerCase();
  console.log(lowcaseName);
  console.log(item.name);
      if (item.name.toLowerCase().includes(lowcaseName)) {
        var contentString = '<div class="placeInfoWindow">' + '<div class="placeName">' + item.name + '</div>' + '<div class="venueCheckins">' + item.stats.checkinsCount + ' people has checked in on foursquare' + '</span>' + '<div class="venueContact">phone:' + item.contact.formattedPhone + '</div>' + '</div>';
  console.log(contentString);
        infowindow.setContent(contentString);
        return;
      }
    }
    infowindow.setContent('<h4>Can\'t find it on foursquare</h4>');
  }).error(function(e) {
    console.log('error');
    infowindow.setContent('<h4>There is problem to retrieve data</br>Please try again later</h4>');
  });

}

var ViewModel = function() {
  var self = this;

  this.showingPlaces = ko.observableArray([]);
  favoritePlaces.forEach(function(placeItem) {
    self.showingPlaces.push(new Place(placeItem));
  });

  this.filterString = ko.observable('');

  this.showInfo = function(clickedPlace) {
    var placeName = clickedPlace.name();
    for (var place in favoritePlaces) {
      if (placeName === favoritePlaces[place].name) {
        map.panTo(markers[place].position);
        map.setZoom(14);

        setInfowindow(favoritePlaces[place]);
//        infowindow.setContent(favoritePlaces[place].address);
        infowindow.open(map, markers[place]);
      }
    }
  };

  this.filterPlaces = function() {
    var filterKeyword = self.filterString().toLowerCase();
    self.showingPlaces([]);
    setMapOnAll(null);
    for (var place in favoritePlaces) {
      if (favoritePlaces[place].name.toLowerCase().includes(filterKeyword)) {
        self.showingPlaces.push(new Place(favoritePlaces[place]));
        markers[place].setMap(map);
      } else {
        markers[place].setMap(null);
      }
    }

  };
}

window.addEventListener('load', initMap);

ko.applyBindings(new ViewModel());
