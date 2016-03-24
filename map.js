var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    center: {
      lat: 41.177047,
      lng: -98.363792
    },
    zoom: 4
  });
  var styles = [
    {
      stylers: [
        {
          hue: "#5ecceb"
        }, {
          saturation: -20
        }
      ]
    }, {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          lightness: 100
        }, {
          visibility: "simplified"
        }
      ]
    }, {
      featureType: "road",
      elementType: "labels",
      stylers: [
        {
          visibility: "off"
        }
      ]
    }
  ];

  map.setOptions({styles: styles});

  var marker = new google.maps.Marker({
    position: {
      lat: 37.683566,
      lng: -79.192437
    },
    map: map,
    title: 'Virginia!'
  });

  var marker = new google.maps.Marker({
    position: {
      lat: 33.760884,
      lng: -84.383600
    },
    map: map,
    title: 'Georgia!'
  });

  var marker = new google.maps.Marker({
    position: {
      lat: 37.308997,
      lng: -121.832248
    },
    map: map,
    title: 'California!'
  });
}
