// Use Signer from @aws-amplify/core
const { Signer } = window.aws_amplify_core;

// AWS Resources
// Cognito:
const identityPoolId = "eu-central-1:ad58ed2f-b77f-4537-9559-13f912c73af2";

// Amazon Location Service:
var mapName = "here.explore";
var placesName = "explore.place.here";

// center
var lat = 35.68026;
var lng = 139.76744;
var zoom = 17;

// Extract the region from the Identity Pool ID
AWS.config.region = identityPoolId.split(":")[0];

// Instantiate a Cognito-backed credential provider
const credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: identityPoolId,
});

function changeMapLA(){
  mapName = "here.explore.truck";
  lat = 37.279518;
  lng = -121.867905;
  zoom = 12;
  main();
}

function changeMapJapan(){
  mapName = "here.explore";
  lat = 35.68026;
  lng = 139.76744;
  zoom = 17;
  main();
}

function changeMapBerlin(){
  mapName = "here.contrast.berlin";
  lat = 52.520008;
  lng = 13.404954;
  zoom = 12;
  main();
}

function changeMapImagery(){
  mapName = "here.imagery";
  lat = 49.2819;
  lng = -123.1187;
  zoom = 14;
  main();
}

function changeMapHybrid(){
  mapName = "here.hybrid";
  lat = 52.520008;
  lng = 13.404954;
  zoom = 12;
  main();
}

// Sign requests made by MapLibre GL JS using AWS SigV4:
function transformRequest(url, resourceType) {
  if (resourceType === "Style" && !url.includes("://")) {
    // Resolve to an AWS URL
    url = `https://maps.geo.${AWS.config.region}.amazonaws.com/maps/v0/maps/${url}/style-descriptor`;
  }

  if (url.includes("amazonaws.com")) {
    // Sign AWS requests (with the signature as part of the query string)
    return {
      url: Signer.signUrl(url, {
        access_key: credentials.accessKeyId,
        secret_key: credentials.secretAccessKey,
        session_token: credentials.sessionToken,
      }),
    };
  }

  // If not amazonaws.com, falls to here without signing
  return { url };
}

// Initialize a map
async function initializeMap() {
  // Load credentials and set them up to refresh
  await credentials.getPromise();
  
  // Initialize the map
  const mlglMap = new maplibregl.Map({
    container: "map", // HTML element ID of map element
    center: [lng, lat], // initial map center point
    zoom: zoom, // initial map zoom
    style: mapName,
    transformRequest,
  });

  // Add navigation control to the top left of the map
  mlglMap.addControl(new maplibregl.NavigationControl(), "top-left");
  
  return mlglMap;
}

async function main() {
  // Initialize map and AWS SDK for Location Service:
  const map = await initializeMap();
  const location = new AWS.Location({credentials, region: AWS.config.region});

  // Variable to hold marker that will be rendered on click
  let marker;

  // On mouse click, display marker and get results:
  map.on("click", function(e) {
    // Remove any existing marker
    if(marker) {
      marker.remove();
    }

    // Render a marker on clicked point
    marker = new maplibregl.Marker()
      .setLngLat([e.lngLat.lng, e.lngLat.lat])
      .addTo(map);

    // Set up parameters for search call
    let params = {
      IndexName: placesName,
      Position: [e.lngLat.lng, e.lngLat.lat],
      Language: "ja",
      MaxResults: "2"
    };

    // Search for results around clicked point
    location.searchPlaceIndexForPosition(params, function(err, data) {
      if (err) {
        // Write JSON response error to HTML
        document.querySelector("#response").textContent = JSON.stringify(err, undefined, 2);

        // Display error in an alert box
        alert("There was an error searching.");
      } else {
        // Write JSON response data to HTML
        document.querySelector("#response").textContent = JSON.stringify(data, undefined, 2);

        // Display place label in an alert box
        //alert(data.Results[0].Place.Label);
      }
    });
  });
}

main();
