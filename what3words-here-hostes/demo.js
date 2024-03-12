
/**
 * An event listener is added to listen to tap events on the map.
 * Clicking on the map displays an alert box containing the latitude and longitude
 * of the location pressed.
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function setUpClickListener(map) {
  // Attach an event listener to map display
  // obtain the coordinates and display in an alert box.
  map.addEventListener('tap', function (evt) {
    var coord = map.screenToGeo(evt.currentPointer.viewportX,
            evt.currentPointer.viewportY);

    callingHEREW3W(coord);

    logEvent('Clicked at ' + Math.abs(coord.lat.toFixed(4)) +
        ((coord.lat > 0) ? 'N' : 'S') +
        ' ' + Math.abs(coord.lng.toFixed(4)) +
         ((coord.lng > 0) ? 'E' : 'W'));
  });
}


function callingHEREW3W(coord){
  const apiUrl = 'https://what3words.search.hereapi.com/v3/convert-to-3wa';

  // Set up query parameters
  const queryParams = {
    coordinates: ''+coord.lat+','+coord.lng,
    language: 'en',
    format: 'json',
    apiKey: window.apikey,
  };

  // Convert query parameters to a string
  const queryString = new URLSearchParams(queryParams).toString();

  // Combine API endpoint with query parameters
  const fullUrl = `${apiUrl}?${queryString}`;

  // Make a GET request using the Fetch API
  fetch(fullUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Process the list of recent users
      console.log('Response: ', data);
      logEvent("whats3words : " + data.words);
      setCenter(data.coordinates);
      drawRectangle(data.square.northeast, data.square.southwest);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  function setCenter(coordinates){
    map.setCenter(coordinates);
    map.setZoom(22);
    //map.setZoom(15);
  }

  function drawRectangle(northeast, southwest){
    map.removeObjects(map.getObjects());
    var boundingBox = new H.geo.Rect(northeast.lat, southwest.lng, southwest.lat, northeast.lng);
      map.addObject(
        new H.map.Rect(boundingBox, {
          style: {
            fillColor: '#FFFFCC',
            strokeColor: '#E8FA75',
            lineWidth: 2
          },
    })
  );
  }


/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map,{
  center: {lat: 34.052235, lng: -118.243683},
  zoom: 12,
  pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: create custom logging facilities
var logContainer = document.createElement('ul');
logContainer.className ='log';
logContainer.innerHTML = '<li class="log-entry">Try clicking on the map</li>';
map.getElement().appendChild(logContainer);

// Helper for logging events
function logEvent(str) {
  var entry = document.createElement('li');
  entry.className = 'log-entry';
  entry.textContent = str;
  logContainer.insertBefore(entry, logContainer.firstChild);
}


setUpClickListener(map);