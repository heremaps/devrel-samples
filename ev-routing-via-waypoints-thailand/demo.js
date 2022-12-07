/**
 * Calculates and displays a car route from the Brandenburg Gate in the centre of Berlin
 * to Friedrichstraße Railway Station.
 *
 * A full list of available request parameters can be found in the Routing API documentation.
 * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-calculate-route.html
 *
 * @param {H.service.Platform} platform A stub class to access HERE services
 */

const EVorigin = '19.910480,99.840576'; //Chiang Rai
const waypoints = [
  '18.796143,98.979263', //Chiang Mai
  '17.413841,102.787233', //Udon Thani
  '16.439625,102.828728', //Khon Kaen
  '13.1244,100.9996', // Chaophraya Surasak
  '13.736717,100.591507' //Bangkok
];
const EVdestination = '7.00836,100.47668'; //Hat Yai

function calculateRouteFromAtoB(platform) {
  var router = platform.getRoutingService(null, 8),
      routeRequestParams = {
      'transportMode': 'car',
      'origin': EVorigin,
      'via': new H.service.Url.MultiValueQueryParameter(waypoints), 
      'destination': EVdestination,
      'return': 'polyline,turnByTurnActions,actions,instructions,travelSummary,spans', 
      'ev[freeFlowSpeedTable]':'0,0.239,27,0.239,45,0.259,60,0.196,75,0.207,90,0.238,100,0.26,110,0.296,120,0.337,130,0.351,250,0.351',
      'ev[trafficSpeedTable]':'0,0.349,27,0.319,45,0.329,60,0.266,75,0.287,90,0.318,100,0.33,110,0.335,120,0.35,130,0.36,250,0.36',
      'ev[auxiliaryConsumption]':'1.8',
      'ev[ascent]':'9',
      'ev[descent]':'4.3',
      'ev[initialCharge]':'99',
      'ev[maxCharge]':'99',
      'ev[chargingCurve]':'0,239,32,199,56,167,60,130,64,111,68,83,72,55,76,33,78,17,80,1',
      'ev[maxChargingVoltage]':'400',
      'ev[maxChargeAfterChargingStation]':'75',
      'ev[minChargeAtChargingStation]':'8',
      'ev[minChargeAtDestination]':'8',
      'ev[chargingSetupDuration]':'300',
      'ev[makeReachable]':'true',
      'ev[connectorTypes]':'iec62196Type1Combo,iec62196Type2Combo,Chademo,Tesla'
      };

  router.calculateRoute(
    routeRequestParams,
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
  //console.log(route);

  /*
   * The styling of the route response on the map is entirely under the developer's control.
   * A representative styling can be found the full JS + HTML code of this example
   * in the functions below:
   */
  addRouteShapeToMap(route);
  addManueversToMap(route);
  addWaypointsToPanel(route);
  addSummaryToPanel(route);
  addManueversToPanel(route);
  //setting map center to Bangkok
  map.setCenter({lat:13.736717, lng:100.591507});
  map.setZoom(6);
  // ... etc.
  
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
  routeInstructionsContainer = document.getElementById('directionPanel');

// Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: window.apikey
});

var defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map - this map is centered over Bangkok
var map = new H.Map(mapContainer,
  defaultLayers.vector.normal.map, {
  center: {lat:13.736717, lng:100.591507},
  zoom: 6,
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
function addRouteShapeToMap(route) {
  route.sections.forEach((section) => {
    // decode LineString from the flexible polyline
    let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

    // Create a polyline to display the route:
    let polyline = new H.map.Polyline(linestring, {
      style: {
        lineWidth: 4,
        strokeColor: 'rgba(0, 128, 255, 0.7)'
      }
    });

    // Add the polyline to the map
    map.addObject(polyline);
    // And zoom to its bounding rectangle
    map.getViewModel().setLookAtData({
      bounds: polyline.getBoundingBox()
    });
  });
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addManueversToMap(route) {
  var svgEVMarkup = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-ev-station-fill" viewBox="0 0 16 16"><path d="M1 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1 2 2v.5a.5.5 0 0 0 1 0V9c0-.258-.104-.377-.357-.635l-.007-.008C13.379 8.096 13 7.71 13 7V4a.5.5 0 0 1 .146-.354l.5-.5a.5.5 0 0 1 .708 0l.5.5A.5.5 0 0 1 15 4v8.5a1.5 1.5 0 1 1-3 0V12a1 1 0 0 0-1-1v4h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V2Zm2 .5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5Zm2.631 9.96H4.14v-.893h1.403v-.505H4.14v-.855h1.49v-.54H3.485V13h2.146v-.54Zm1.316.54h.794l1.106-3.333h-.733l-.74 2.615h-.031l-.747-2.615h-.764L6.947 13Z"/></svg>',
  dotMarkup = '<svg width="18" height="18" ' +
  'xmlns="http://www.w3.org/2000/svg">' +
  '<circle cx="8" cy="8" r="8" ' +
    'fill="#1b468d" stroke="white" stroke-width="1" />' +
  '</svg>',
    dotIcon = new H.map.Icon(dotMarkup, {anchor: {x:8, y:8}}),
    EVIcon = new H.map.Icon(svgEVMarkup, {anchor: {x:8, y:8}}),
    group = new H.map.Group(),
    i,
    j;
  //adding departing marker
    var dotMarker = new H.map.Marker({
      lat: 19.910480,
      lng: 99.840576},
      {icon: dotIcon});
      dotMarker.instruction = "Departing from Chiang Rai";
      group.addObject(dotMarker);

  route.sections.forEach((section, index, theArray) => {
    let poly = H.geo.LineString.fromFlexiblePolyline(section.polyline).getLatLngAltArray();

    let actions = section.actions;
    
    let action = actions[actions.length-1];
      var EVMarker = new H.map.Marker({
        lat: poly[action.offset * 3],
        lng: poly[action.offset * 3 + 1]},
        {icon: EVIcon});
        var dotMarker = new H.map.Marker({
          lat: poly[action.offset * 3],
          lng: poly[action.offset * 3 + 1]},
          {icon: dotIcon});
    if (index < theArray.length -1 && index >-1 && section.postActions){
    
      EVMarker.instruction = section.postActions[1].action + " " 
      + "Arrival Charge: " + section.postActions[1].arrivalCharge + "% " 
      + "Consumable Power: " + section.postActions[1].consumablePower + " " 
      + "Duration: " + toMMSS(section.postActions[1].duration) + " " 
      + "Target Charge: " + section.postActions[1].targetCharge + "% ";
      group.addObject(EVMarker);
      
    }else{
      dotMarker.instruction = action.instruction;
      group.addObject(dotMarker);
    }
    

    group.addEventListener('tap', function (evt) {
      map.setCenter(evt.target.getGeometry());
      openBubble(evt.target.getGeometry(), evt.target.instruction);
    }, false);

    // Add the maneuvers group to the map
    map.addObject(group);
  });
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addWaypointsToPanel(route) {
  var nodeH3 = document.createElement('h3'),
    labels = [];

  route.sections.forEach((section) => {
    if (section.index < section.length)labels.push(
      section.turnByTurnActions[0].nextRoad.name[0].value);
    if (section.index > 0) labels.push(
      section.turnByTurnActions[section.turnByTurnActions.length - 1].currentRoad.name[0].value);
  });

  nodeH3.textContent = labels.join(' - ');
  routeInstructionsContainer.innerHTML = '';
  routeInstructionsContainer.appendChild(nodeH3);
  var subTitle = document.createElement('p');
  subTitle.innerHTML= "<p>This example calculates the EV car route in some of the biggest cities in <b>Thailand</b> from <b>Chiang Rai (North)</b> to <b>Hat Yai (South)</b> via Chiang Mai, Udon Thani, Khon Kaen, Chaophraya Surasak and Bangkok.</p>";
  routeInstructionsContainer.appendChild(subTitle);

}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
 function addSummaryToPanel(route) {
  var directionSubtitle = document.createElement('p');
  directionSubtitle.innerHTML= "<h3>Summary:</h3>";
  routeInstructionsContainer.appendChild(directionSubtitle);


  let duration = 0,
  chargingDuration = 0,
    distance = 0;

  route.sections.forEach((section, index, theArray) => {
    distance += section.travelSummary.length;
    duration += section.travelSummary.duration;
    //adding charging time 
    if (index < theArray.length -1 && section.postActions) {
      chargingDuration += section.postActions[0].duration + section.postActions[1].duration;
      duration += section.postActions[0].duration + section.postActions[1].duration;}
  });

  var summaryDiv = document.createElement('div'),
    content = '<b>Total distance</b>: ' + (distance/1000*0.62137).toFixed(2) + ' miles. <br />' +
    '<b>Charging Time</b>: ' + toHHMMSS(chargingDuration) + '<br />' +
      '<b>Travel Time</b>: ' + toHHMMSS(duration) + ' (in current traffic)';

  summaryDiv.style.fontSize = 'small';
  summaryDiv.style.marginLeft = '5%';
  summaryDiv.style.marginRight = '5%';
  summaryDiv.innerHTML = content;
  routeInstructionsContainer.appendChild(summaryDiv);
}


/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
 function addManueversToPanel(route) {
  var directionSubtitle = document.createElement('p');
  directionSubtitle.innerHTML= "<h3>Charging Stops:</h3>";
  routeInstructionsContainer.appendChild(directionSubtitle);

  var nodeOL = document.createElement('ol');

  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft ='5%';
  nodeOL.style.marginRight ='5%';
  nodeOL.className = 'directions';

  route.sections.forEach((section, sid, theSArray) => {
    section.actions.forEach((action, idx, theArray) => {
      var li = document.createElement('li'),
        spanArrow = document.createElement('span'),
        spanInstruction = document.createElement('span');
      
      //removing turn-by-turn driving directions
      //spanArrow.className = 'arrow ' + (action.direction || '') + action.action;
      //spanInstruction.innerHTML = section.actions[idx].instruction;
      //li.appendChild(spanArrow);
      //li.appendChild(spanInstruction);

      //nodeOL.appendChild(li);

      //charging stops details
      if (idx == theArray.length-1 && sid < theSArray.length - 1 && section.postActions) {
        //spanInstruction.innerHTML = "<b>Location:</b> " + section.arrival.place.location.lat + "," + section.arrival.place.location.lng + ". <br>";
        spanArrow.className = 'arrow ' + section.postActions[1].action;
        spanInstruction.innerHTML += "<b>Details:</b> " + " " 
      + "Arrival Charge: " + (section.postActions[1].arrivalCharge).toFixed(1) + "%, " 
      + "Consumable Power: " + section.postActions[1].consumablePower + ", " 
      + "Duration: " + toMMSS(section.postActions[1].duration) + ", " 
      + "Target Charge: " + section.postActions[1].targetCharge + "%, ";
      li.appendChild(spanArrow);
      li.appendChild(spanInstruction);

      nodeOL.appendChild(li);
      }      
    });
  });

  routeInstructionsContainer.appendChild(nodeOL);
}

function toMMSS(duration) {
  return Math.floor(duration / 60) + ' minutes ' + (duration % 60) + ' seconds.';
}

function toHHMMSS(duration) {
  return Math.floor(duration / 3600) + ' hours ' + Math.floor(duration % 3600 /60) + ' minutes ' + (duration % 60) + ' seconds.';
}

// Now use the map as required...
calculateRouteFromAtoB(platform);
