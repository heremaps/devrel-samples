document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Leaflet map
    const map = L.map('map').setView([47.606209, -122.332069], 13);

    // HERE base map layer setup
    const hereApiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    const hereTileUrl = `https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?style=lite.day&apiKey=${hereApiKey}`;
    L.tileLayer(hereTileUrl, { attribution: '&copy; HERE 2024' }).addTo(map);

    // Legend for traffic data
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = '<h4>Traffic Status</h4>' + 
                        '<i style="background:#2ECC40"></i> Low<br>' +
                        '<i style="background:#FF851B"></i> Moderate<br>' +
                        '<i style="background:#FF4136"></i> High';
        return div;
    };
    legend.addTo(map);

    // Fetch and display real-time traffic data (simplified for boilerplate)
    // Define the HERE Traffic API URL
    const hereTrafficApiUrl = `https://data.traffic.hereapi.com/v7/flow?locationReferencing=shape&in=bbox:-122.351018,47.571051,-122.275047,47.658364&apiKey=${hereApiKey}`;

    // Fetch traffic data and process it
    fetch(hereTrafficApiUrl)
        .then(response => response.json())
        .then(data => {
            // Process and visualize the traffic data on the map
            // (Add the simplified processing logic here)
        })
        .catch(error => console.error('Error fetching traffic data:', error));
});
