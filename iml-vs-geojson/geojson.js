function showGeoJSONData (map) {
  // Create GeoJSON reader which will download the specified file.
  // Shape of the file was obtained by using HERE Geocoder API.
  // It is possible to customize look and feel of the objects.
  var reader = new H.data.geojson.Reader('data/germanynorth.json', {
    // This function is called each time parser detects a new map object
    style: function (mapObject) {
      // Parsed geo objects could be styled using setStyle method
      
    }
  });

  // Start parsing the file
  reader.parse();

  // Add layer which shows GeoJSON data on the map
  map.addLayer(reader.getLayer());
}

/**
 * Boilerplate map initialization code starts below:
 */
// Step 1: initialize communication with the platform
var goejson_platform = new H.service.Platform({
  apikey: '<insert API KEY>'
});
var goejson_defaultLayers = goejson_platform.createDefaultLayers();

// Step 2: initialize a map
var goejson_map = new H.Map(document.getElementById('geojsonMap'), goejson_defaultLayers.vector.normal.map, {
  center: new H.geo.Point(54.083336, 12.108811),
  zoom: 7,
  pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => goejson_map.getViewPort().resize());


// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var goejson_behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(goejson_map));

// Create the default UI components
var goejson_ui = H.ui.UI.createDefault(goejson_map, goejson_defaultLayers);

showGeoJSONData(goejson_map);