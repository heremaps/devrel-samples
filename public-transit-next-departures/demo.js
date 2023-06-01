/**
 * Calculates and displays the location of the 'Eiffel Tower'
 * using a landmark geocoding search
 *
 *
 * A full list of available request parameters can be found in the Geocoder API documentation.
 * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-search.html
 *
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */
function publicTransitNextDepartures(platform, at) {
  var publicTransit = platform.getPublicTransitService(),
      publicTransitParameters = {
        in:at,
        return:'transport',
        maxPlaces:50
      };

  publicTransit.getDepartures(
    publicTransitParameters,
    onSuccess,
    onError
  );
}

const cities = [
  {
      id: 0,
      value: "ams",
      name: "Amsterdam Centraal, Amsterdam, Netherland",
      position: '52.379189,4.899431;r=1000',
      mapZoom: 16,
      mapCenter: {lat:52.379189, lng:4.899431} 
  },
  {
      id: 1,
      value: "paris",
      name: "Gare Du Nord, Paris, France",
      position: "48.880948,2.3553137000000106;r=1000",
      mapZoom: 16,
      mapCenter: {lat:48.880948, lng:2.3553137000000106}
  },
  {
      id: 2,
      value: "bcn",
      name: "Barcelona Sant, Bercelona, Spain",
      position: "41.379037,2.140168;r=1000",
      mapZoom: 16,
      mapCenter: {lat:41.379037, lng:2.140168}
  },
  {
      id: 3,
      value: "smn",
      name: "Firenze SMN, Florence, Italy",
      position: "43.7723,11.2422;r=1000",
      mapZoom: 16,
      mapCenter: {lat:43.7723, lng:11.2422}
  },
  {
      id: 4,
      value: "waterloo",
      name: "Waterloo Station, London, UK",
      position: "51.503814,-0.114112;r=1000",
      mapZoom: 16,
      mapCenter: {lat:51.503814, lng:-0.114112}
  },
  {
      id: 5,
      value: "frk",
      name: "Frankfurt (Main) Hauptbahnhof, Frankfurt, Germany",
      position: "50.1042,8.6575;r=1000",
      mapZoom: 16,
      mapCenter: {lat:50.1042, lng:8.6575}
  }

]

function createUIforDropdown() {
  
  var subTitle = document.createElement('p');
  subTitle.innerHTML= "<p>This example shows public transit boardings within 1 km radius of below location</p>";
  discoveryTitleContainer.appendChild(subTitle);

  var cityDropdown = document.createElement("SELECT");
  cityDropdown.setAttribute("id", "cityDropDown");
  discoveryTitleContainer.appendChild(cityDropdown);

  for (var i = 0; i < cities.length; i++) {
    var option = document.createElement("option");
    option.value = cities[i].value;
    option.text = cities[i].name;
    document.getElementById("cityDropDown").appendChild(option);
  }

  var space = document.createElement('p');
  discoveryTitleContainer.appendChild(space);
  
  function eventCities(){
    clearMap();
    citiesIndex = this.selectedIndex;
    publicTransitNextDepartures(platform, cities[citiesIndex].position)
  }
  
  document.getElementById("cityDropDown").onchange = eventCities;
  
}

function clearMap(){
  locationsContainer.innerHTML = '';
  map.removeObjects(map.getObjects())
}

/**
 * This function will be called once the Geocoder REST API provides a response
 * @param  {Object} result          A JSONP object representing the  location(s) found.
 *
 * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-type-response-geocode.html
 */
function onSuccess(result) {
  var boards = result.boards;
 /*
  * The styling of the geocoding response on the map is entirely under the developer's control.
  * A representitive styling can be found the full JS + HTML code of this example
  * in the functions below:
  */
  addLocationsToMap(boards);
  addLocationsToPanel(boards);
  // ... etc.
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
  alert('Can\'t reach the remote server');
}

var citiesIndex = 0;

/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - this map is centered over California
var map = new H.Map(document.getElementById('maps'),
  defaultLayers.vector.normal.map,{
  center: {lat:52.379189, lng:4.899431},
  zoom: 16,
  pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

var locationsContainer = document.getElementById('discoveryPanel');
var discoveryTitleContainer = document.getElementById('discoveryTitle');

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Hold a reference to any infobubble opened
var bubble;

/**
 * Opens/Closes a infobubble
 * @param  {H.geo.Point} position     The location on the map.
 * @param  {String} text              The contents of the infobubble.
 */
function openBubble(position, text){
 if(!bubble){
    bubble =  new H.ui.InfoBubble(
      position,
      {content: text});
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}

/**
 * Creates a series of list items for each location found, and adds it to the panel.
 * @param {Object[]} locations An array of locations as received from the
 *                             H.service.GeocodingService
 */
function addLocationsToPanel(boards){

  var nodeOL = document.createElement('ul'),
      i;

  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft ='5%';
  nodeOL.style.marginRight ='5%';


  for (i = 0;  i < boards.length; i += 1) {
    let board = boards[i],
        li = document.createElement('li'),
        divLabel = document.createElement('div'),
        content =  '<strong style="font-size: large;">' + board.place.name  + '</strong></br>';

        if (board.departures){
        departure = board.departures[0];

      content += '<strong>Departure time:</strong> ' + departure.time + '<br/>';
      content += '<strong>Agency name:</strong> '  + departure.agency.name + '<br/>';
      content += '<strong>Transport:</strong> '  + departure.transport.headsign + '<br/>';
        }

      divLabel.innerHTML = content;
      li.appendChild(divLabel);

      nodeOL.appendChild(li);
  }

  locationsContainer.appendChild(nodeOL);
}


/**
 * Creates a series of H.map.Markers for each location found, and adds it to the map.
 * @param {Object[]} locations An array of locations as received from the
 *                             H.service.GeocodingService
 */
function addLocationsToMap(boards){
  var group = new  H.map.Group(),
      i;

  // Add a marker for each location found
  for (i = 0;  i < boards.length; i += 1) {
    let board = boards[i];
    marker = new H.map.Marker(board.place.location);
    marker.label = board.place.name + ". Next Departure: " + board.departures[0].time + ". Agency: " + board.departures[0].agency.name;
    group.addObject(marker);
  }

  group.addEventListener('tap', function (evt) {
    map.setCenter(evt.target.getGeometry());
    openBubble(
       evt.target.getGeometry(), evt.target.label);
  }, false);

  // Add the locations group to the map
  map.addObject(group);
  map.setCenter(cities[citiesIndex].mapCenter);
  map.setZoom(cities[citiesIndex].mapZoom);
}

// Now use the map as required...
publicTransitNextDepartures(platform, cities[0].position);
createUIforDropdown();

