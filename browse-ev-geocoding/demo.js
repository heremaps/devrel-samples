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
function browseGeocode(platform, at) {
  var geocoder = platform.getSearchService(),
      browseParameters = {
        categories: '700-7600-0322,700-7600-0325',
        at: at,
        limit: 20
      };

  geocoder.browse(
    browseParameters,
    onSuccess,
    onError
  );
}

const cities = [
  {
      id: 0,
      value: "pdx",
      name: "Portland, OR",
      position: "45.52,-122.68",
      mapZoom: 14,
      mapCenter: {lat:45.52, lng:-122.68} //ridgecrest,ca
  },
  {
      id: 1,
      value: "chi",
      name: "Chicago, IL",
      position: "41.8781136,-87.6297982",
      mapZoom: 14,
      mapCenter: {lat:41.8781136, lng:-87.6297982}
  },
  {
      id: 2,
      value: "newyork",
      name: "New York City, NY",
      position: "40.776676,-73.971321",
      mapZoom: 14,
      mapCenter: {lat:40.776676, lng:-73.971321}
  }

]

function createUIforDropdown() {
  
  var subTitle = document.createElement('p');
  subTitle.innerHTML= "<p>This example shows 20 EV Charging Stations from below cities</p>";
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
    browseGeocode(platform, cities[citiesIndex].position)
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
  var locations = result.items;
 /*
  * The styling of the geocoding response on the map is entirely under the developer's control.
  * A representitive styling can be found the full JS + HTML code of this example
  * in the functions below:
  */
  addLocationsToMap(locations);
  addLocationsToPanel(locations);
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
  center: {lat:45.52, lng:-122.68},
  zoom: 13,
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
function addLocationsToPanel(locations){

  var nodeOL = document.createElement('ul'),
      i;

  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft ='5%';
  nodeOL.style.marginRight ='5%';


  for (i = 0;  i < locations.length; i += 1) {
    let location = locations[i],
        li = document.createElement('li'),
        divLabel = document.createElement('div'),
        content =  '<strong style="font-size: large;">' + location.title  + '</strong></br>';
        position = location.position;

      content += '<strong>houseNumber:</strong> ' + location.address.houseNumber + '<br/>';
      content += '<strong>street:</strong> '  + location.address.label + '<br/>';
      content += '<strong>district:</strong> '  + location.address.district + '<br/>';
      content += '<strong>city:</strong> ' + location.address.city + '<br/>';
      content += '<strong>postalCode:</strong> ' + location.address.postalCode + '<br/>';
      content += '<strong>county:</strong> ' + location.address.county + '<br/>';
      content += '<strong>country:</strong> ' + location.address.countryName + '<br/>';
      content += '<strong>position:</strong> ' +
        Math.abs(position.lat.toFixed(4)) + ((position.lat > 0) ? 'N' : 'S') +
        ' ' + Math.abs(position.lng.toFixed(4)) + ((position.lng > 0) ? 'E' : 'W') + '<br/>';

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
function addLocationsToMap(locations){
  var group = new  H.map.Group(),
      i;

  // Add a marker for each location found
  for (i = 0;  i < locations.length; i += 1) {
    let location = locations[i];
    marker = new H.map.Marker(location.position);
    marker.label = location.title;
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
browseGeocode(platform, "45.52,-122.68");
createUIforDropdown();

