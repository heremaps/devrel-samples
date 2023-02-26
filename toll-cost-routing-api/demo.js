/**
 * A full list of available request parameters can be found in the Routing API documentation.
 * see:  http://developer.here.com/rest-apis/documentation/routing/topics/resource-calculate-route.html
 */
var routeRequestParams = {
  routingMode: 'fast',
  transportMode: 'truck',
  origin: '40.7249546323,-74.0110042', // Manhattan
  destination: '40.7324386599,-74.0341396', // Newport
  return: 'polyline,travelSummary,tolls',
  units: 'imperial',
  spans: 'truckAttributes'
},
routes = new H.map.Group();

function calculateRoutes(platform) {
var router = platform.getRoutingService(null, 8);

// The green route showing a truck route with a trailer
calculateRoute(router, Object.assign(routeRequestParams, {
'truck[axleCount]': 4,
}), {
strokeColor: 'rgba(25, 150, 10, 0.7)',
lineWidth: 10
});

// The violet route showing a truck route with a trailer
calculateRoute(router, Object.assign(routeRequestParams, {
'truck[axleCount]': 5,
'truck[shippedHazardousGoods]': 'flammable'
}), {
strokeColor: 'rgba(255, 0, 255, 0.7)',
lineWidth: 5
});
}

/**
* Calculates and displays a route.
* @param {Object} params The Routing API request parameters
* @param {H.service.RoutingService} router The service stub for requesting the Routing API
* @param {mapsjs.map.SpatialStyle.Options} style The style of the route to display on the map
*/
function calculateRoute (router, params, style) {
router.calculateRoute(params, function(result) {
addRouteShapeToMap(style, result.routes[0]);
addManueversToMap(result.routes[0]);
}, console.error);
}

/**
* Boilerplate map initialization code starts below:
*/

// set up containers for the map  + panel
var mapContainer = document.getElementById('map');

// Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
apikey: window.apikey
});

var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map - this map is centered over Berlin
var map = new H.Map(mapContainer,
// Set truck restriction layer as a base map
defaultLayers.vector.normal.truck,{
center: {lat: 40.745390, lng: -74.022917},
zoom: 13.2,
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

map.addObject(routes);

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

/**
* Creates a H.map.Polyline from the shape of the route and adds it to the map.
* @param {Object} route A route as received from the H.service.RoutingService
*/
function addRouteShapeToMap(style, route){
route.sections.forEach((section) => {
// decode LineString from the flexible polyline
let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

// Create a polyline to display the route:
let polyline = new H.map.Polyline(linestring, {
  style: style
});

// Add the polyline to the map
routes.addObject(polyline);
// And zoom to its bounding rectangle
map.getViewModel().setLookAtData({
  bounds: routes.getBoundingBox()
});
});
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addManueversToMap(route) {
  var svgEVMarkup = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#004744" class="bi bi-ev-station-fill" viewBox="0 0 16 16"><path d="M1 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1 2 2v.5a.5.5 0 0 0 1 0V9c0-.258-.104-.377-.357-.635l-.007-.008C13.379 8.096 13 7.71 13 7V4a.5.5 0 0 1 .146-.354l.5-.5a.5.5 0 0 1 .708 0l.5.5A.5.5 0 0 1 15 4v8.5a1.5 1.5 0 1 1-3 0V12a1 1 0 0 0-1-1v4h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V2Zm2 .5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5Zm2.631 9.96H4.14v-.893h1.403v-.505H4.14v-.855h1.49v-.54H3.485V13h2.146v-.54Zm1.316.54h.794l1.106-3.333h-.733l-.74 2.615h-.031l-.747-2.615h-.764L6.947 13Z"/></svg>',
  dotMarkup = '<svg width="18" height="18" ' +
  'xmlns="http://www.w3.org/2000/svg">' +
  '<circle cx="8" cy="8" r="8" ' +
    'fill="#004744" stroke="white" stroke-width="1" />' +
  '</svg>',
    dotIcon = new H.map.Icon(dotMarkup, {anchor: {x:8, y:8}}),
    tollIcon = new H.map.Icon("tolls.png", {size: {w:40,h:40}}),
    group = new H.map.Group(),
    i,
    j;
  //adding departing marker
    var depMarker = new H.map.Marker({
      lat: 40.7249546323,
      lng: -74.0110042},
      {icon: dotIcon});
      depMarker.instruction = "Departing from Manhattan";
      group.addObject(depMarker);

  //adding arriving marker
  var arrivingMarker = new H.map.Marker({
    lat: 40.7324386599,
    lng: -74.0341396},
    {icon: dotIcon});
    arrivingMarker.instruction = "Arriving at Newport";
    group.addObject(arrivingMarker);


  route.sections.forEach((section, index, theArray) => {
    if (section.tolls){
      let tollSystems = section.tollSystems;
      let tolls = section.tolls;

      tolls.forEach((toll)=>{
        toll.tollCollectionLocations.forEach((tollCollectionLocation)=>{
          var tollMarker = new H.map.Marker({
            lat: tollCollectionLocation.location.lat,
            lng: tollCollectionLocation.location.lng},
            {icon: tollIcon});
          tollMarker.instruction = "Toll System: " + toll.tollSystem 
          + "<br>Toll Collection Location: " + tollCollectionLocation.name
          + "<br>Toll Fares: " + toll.fares[0].price.value + " " + toll.fares[0].price.currency 
          + "<br>Payment Method: " + toll.fares[0].paymentMethods[0];
          group.addObject(tollMarker);
        });
        
        
      });    

    group.addEventListener('tap', function (evt) {
      map.setCenter(evt.target.getGeometry());
      openBubble(evt.target.getGeometry(), evt.target.instruction);
    }, false);

    // Add the maneuvers group to the map
    map.addObject(group);
  }
  });
}


// Now use the map as required...
calculateRoutes (platform);