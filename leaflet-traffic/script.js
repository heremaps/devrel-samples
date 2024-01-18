// HERE Traffic App Sample using Leaflet.js
// Documentation for Raster Tile API: https://www.here.com/docs/bundle/raster-tile-api-migration-guide/page/README.html
// Traffic API Guide: https://www.here.com/docs/bundle/traffic-api-developer-guide-v7/page/topics/getting-started/send-request.html

// HERE base map layer and authorization using the new Map Tile API
const here = {
    apiKey: 'YOUR_API_KEY' // Replace with your actual API key
};

//Initialize Leaflet Map
document.addEventListener('DOMContentLoaded', function() {
    // Creating the map instance and setting the view
    const map = L.map('map', {
        center: [47.606209, -122.332069], // Set the initial center of the map
        zoom: 13 // Set the initial zoom level
    });

    // Define the map style for the HERE base map
    const style = 'lite.day'; // Style can be changed as per requirement

    // Constructing the tile layer URL for HERE base map using the new format
    const hereTileUrl = `https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?style=${style}&apiKey=${here.apiKey}`;

    // Adding the HERE tile layer to the map
    L.tileLayer(hereTileUrl, {
        attribution: '&copy; HERE Technologies 2024'
    }).addTo(map);

    // Initialize a layer group to manage traffic lines on the map
    var trafficLayerGroup = L.layerGroup().addTo(map);

    // Function to convert speed from Km/h to Mph
    function convertKmToMph(speedKm) {
        const kmToMphFactor = 0.621371;
        return speedKm * kmToMphFactor;
    }

    // Function to determine the line color based on Jam Factor
    function getLineColor(jamFactor) {
        if (jamFactor <= 3) {
            return '#2ECC40'; // Green for low congestion
        } else if (jamFactor <= 7) {
            return '#FF851B'; // Orange for moderate congestion
        } else {
            return '#FF4136'; // Red for high congestion
        }
    }

    // Create and add a legend to display congestion levels
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'legend'),
            jamFactorClasses = [
                { range: "0 - 3", description: "Low Congestion", color: "#2ECC40" },
                { range: "4 - 7", description: "Moderate Congestion", color: "#FF851B" },
                { range: "8 - 10", description: "High Congestion", color: "#FF4136" }
            ],
            labels = ['<h3>Jam Factor</h3>'];

        jamFactorClasses.forEach(function (jfClass) {
            labels.push(
                '<div class="label">' +
                    '<i style="background:' + jfClass.color + '"></i> ' +
                    jfClass.range + ': ' + jfClass.description +
                '</div>');
        });

        div.innerHTML = labels.join('');
        return div;
    };

    legend.addTo(map);

    // Fetching and processing HERE Traffic API data
    const hereTrafficApiUrl = `https://data.traffic.hereapi.com/v7/flow?locationReferencing=shape&in=bbox:-122.351018,47.571051,-122.275047,47.658364&functionalClasses=1,2,3,4&apiKey=${here.apiKey}`;

    fetch(hereTrafficApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.results) {
                data.results.forEach(item => {
                    const location = item.location;
                    const flow = item.currentFlow;
                    
                    if (location && location.shape && location.shape.links) {
                        location.shape.links.forEach(link => {
                            link.points.forEach((point, index, pointsArray) => {
                                if (index < pointsArray.length - 1) {
                                    var pointA = new L.LatLng(point.lat, point.lng);
                                    var pointB = new L.LatLng(pointsArray[index + 1].lat, pointsArray[index + 1].lng);
                                    var lineColor = getLineColor(flow.jamFactor);

                                    var line = new L.polyline([pointA, pointB], {
                                        color: lineColor,
                                        weight: 5
                                    }).addTo(trafficLayerGroup);

                                                                        // Create popup content for each line
                                                                        var popupContent = `Speed: ${flow.speed} km/h (${convertKmToMph(flow.speed).toFixed(1)} mph)<br>Jam Factor: ${flow.jamFactor}`;
                                                                        line.bindPopup(popupContent);
                                    
                                                                        // Setup event handlers for hover
                                                                        line.on('mouseover', function() {
                                                                            this.openPopup();
                                                                        });
                                                                        line.on('mouseout', function() {
                                                                            this.closePopup();
                                                                        });
                                                                    }
                                                                });
                                                            });
                                                        }
                                                    });
                                                } else {
                                                    console.log('No traffic data available');
                                                }
                                            })
                                            .catch(error => console.error('Error fetching traffic data:', error));
                                    
                                        // Add Layer Control box to toggle between base map and traffic layers
                                        var baseMaps = {
                                            "Base Map": L.tileLayer(hereTileUrl)
                                        };
                                        var overlayMaps = {
                                            "Traffic": trafficLayerGroup
                                        };
                                    
                                        L.control.layers(baseMaps, overlayMaps).addTo(map);
                                    
                                    }); // End of DOMContentLoaded
                                    
