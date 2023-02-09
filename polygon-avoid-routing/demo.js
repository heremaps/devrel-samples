/**
 * Calculates and displays a car route from the Brandenburg Gate in the centre of Berlin
 * to Friedrichstraße Railway Station.
 *
 * A full list of available request parameters can be found in the Routing API documentation.
 * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-calculate-route.html
 *
 * @param {H.service.Platform} platform A stub class to access HERE services
 */

var initialPolygonRed = 'polygon:34.073334,-118.027496;33.888504,-117.813255;33.895847,-118.220070'; //Arcadia, Yorba Linda, Compton

function calculateRouteFromAtoB(platform, avoidArea) {
  var router = platform.getRoutingService(null, 8);

  var params = {
    'routingMode': 'fast',
    'transportMode': 'car',
    'origin': '33.751305,-118.188812', // Port of Long Beach
    'destination': '34.092232,-117.435051', // Fontana
    'avoid[areas]': avoidArea,
    'return': 'polyline'
  };

  router.calculateRoute(
    params,
    onSuccess,
    onError
  );
}

/**
 * This function will be called once the Routing REST API provides a response
 * @param {Object} result A JSONP object representing the calculated route
 *
 * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
 */
function onSuccess(result) {
  var route = result.routes[0];

  /*
   * The styling of the route response on the map is entirely under the developer's control.
   * A representative styling can be found the full JS + HTML code of this example
   * in the functions below:
   */
  for (i=0;i<map.getObjects().length-1;i++){
    if (map.getObjects()[i].toGeoJSON().type == 'Feature'){
      map.removeObject(map.getObjects()[i]);
    }
  }
  addRouteShapeToMap(route);
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param {Object} error The error message received.
 */
function onError(error) {
  alert('Can\'t reach the remote server');
}

/**
 * Boilerplate map initialization code starts below:
 */

// set up containers for the map + panel
var mapContainer = document.getElementById('map'),
  routeInstructionsContainer = document.getElementById('panel');

// Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});

var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map - this map is centered over Berlin
var map = new H.Map(mapContainer,
  defaultLayers.vector.normal.map, {
  center: {lat: 52.5160, lng: 13.3779},
  zoom: 13,
  pixelRatio: window.devicePixelRatio || 1
});

// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

addPolygonToMap();

// Hold a reference to any infobubble opened
var bubble;

/**
 * Opens/Closes a infobubble
 * @param {H.geo.Point} position The location on the map.
 * @param {String} text          The contents of the infobubble.
 */
function openBubble(position, text) {
  if (!bubble) {
    bubble = new H.ui.InfoBubble(
      position,
      // The FO property holds the province name.
      {content: text});
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}

function addPolygonToMap() {
  var lineStringA = new H.geo.LineString(
    [34.073334,-118.027496, 100, 33.888504,-117.813255,  100, 33.895847,-118.220070,  100,34.073334,-118.027496,  100]
  );

  var polygonRed = new H.map.Polygon(lineStringA, {
    style: {fillColor: 'rgba(255, 0, 0, .5)', lineWidth: 0}
  });

  var draggableGroup = new H.map.Group({
    volatility: true // mark the group as volatile for smooth dragging of all it's objects
  });

  draggableGroup.addObjects([polygonRed]);
  polygonRed.draggable = true;
  map.addObject(draggableGroup);

  draggableGroup.addEventListener('pointerenter', function() {
    document.body.style.cursor = 'pointer';
  }, true);

  // change mouse cursor if left any of group's objects
  draggableGroup.addEventListener('pointerleave', function() {
    document.body.style.cursor = 'default';
  }, true);

  polygonRed.addEventListener('dragstart', function(evt) {
    var pointer = evt.currentPointer,
        object = evt.target;

    // store the starting geo position
    object.setData({
      startCoord: map.screenToGeo(pointer.viewportX, pointer.viewportY)
    });
    evt.stopPropagation();
  });

  polygonRed.addEventListener('drag', function(evt) {
    var pointer = evt.currentPointer,
        object = evt.target,
        startCoord = object.getData()['startCoord'],
        newCoord = map.screenToGeo(pointer.viewportX, pointer.viewportY),
        outOfMapView = false;

    if (!newCoord.equals(startCoord)) {
      var currentLineString = object.getGeometry().getExterior(),
          newLineString = new H.geo.LineString();

      // create new LineString with updated coordinates
      currentLineString.eachLatLngAlt(function (lat, lng, alt) {
        var diffLat = (lat - startCoord.lat),
            diffLng = (lng - startCoord.lng),
            newLat =newCoord.lat + diffLat,
            newLng = newCoord.lng + diffLng;

        // prevent dragging to latitude over 90 or -90 degrees to prevent loosing altitude values
        if (newLat >= 90 || newLat <= -90) {
          outOfMapView = true;
          return;
        }

        newLineString.pushLatLngAlt(newLat, newLng, 0);
      });

      if (!outOfMapView) {
        object.setGeometry(new H.geo.Polygon(newLineString));
        object.setData({
          startCoord: newCoord
        });
      }
    }
    evt.stopPropagation();
    
  });

  polygonRed.addEventListener('dragend', function(evt) {
    var avoidArea = "polygon:";
    var polygonGeojson = evt.target.getGeometry().toGeoJSON();
    for (i=0; i < polygonGeojson.coordinates[0].length-1; i++){
      avoidArea += polygonGeojson.coordinates[0][i][0].toString() + "," + polygonGeojson.coordinates[0][i][1].toString() + ";";
    }
    console.log("avoidArea ", avoidArea)
    calculateRouteFromAtoB(platform, avoidArea);
  });
  
}

/**
 * Creates a H.map.Polyline from the shape of the route and adds it to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addRouteShapeToMap(route) {
  route.sections.forEach((section) => {
    // decode LineString from the flexible polyline
    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

    // Create a polyline to display the route:
    let routePolyline = new H.map.Polyline(linestring, {
      style: {
        lineWidth: 4,
        strokeColor: 'rgba(0, 128, 255, 0.7)'
      }
    });

    // Add the polyline to the map
    map.addObject(routePolyline);
    // And zoom to its bounding rectangle
    map.getViewModel().setLookAtData({
      bounds: routePolyline.getBoundingBox()
    });
  });
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addManueversToMap(route) {
  var svgMarkup = '<svg width="18" height="18" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="8" cy="8" r="8" ' +
      'fill="#1b468d" stroke="white" stroke-width="1" />' +
    '</svg>',
    dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
    group = new H.map.Group(),
    i,
    j;

  route.sections.forEach((section) => {
    let poly = H.geo.LineString.fromFlexiblePolyline(section.polyline).getLatLngAltArray();

    let actions = section.actions;
    // Add a marker for each maneuver
    for (i = 0; i < actions.length; i += 1) {
      let action = actions[i];
      var marker = new H.map.Marker({
        lat: poly[action.offset * 3],
        lng: poly[action.offset * 3 + 1]},
        {icon: dotIcon});
      marker.instruction = action.instruction;
      group.addObject(marker);
    }

    group.addEventListener('tap', function (evt) {
      map.setCenter(evt.target.getGeometry());
      openBubble(evt.target.getGeometry(), evt.target.instruction);
    }, false);

    // Add the maneuvers group to the map
    map.addObject(group);
  });
}


// Now use the map as required...
calculateRouteFromAtoB(platform, initialPolygonRed);
