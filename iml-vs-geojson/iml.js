function addIml(map) {
    // HERE platform stores data in catalogs. Define Here Resource Name (HRN) of the catalog
    const catalogHrn = 'hrn:here:data::olp-here:93448a-5e819f51b';
    // A catalog is a collection of layers that are managed as a single set. Define the layer that stores data
    const layerId = '926971b';
    // Instantiate the IML service
    const service = platform.getIMLService();
    // Create a provider for the custom user defined data
    const imlProvider = new H.service.iml.Provider(service, catalogHrn, layerId, {parameters: {
        mode: "viz",
        vizSampling: "low"
    }});

    // Get the style object
    const style = imlProvider.getStyle();
    // Query the sub-section of the style configuration
    const styleConfig = style.extractConfig(['iml']);

    // Add dashes
    //styleConfig.layers.iml.lines.draw.lines.dash = [1, 1];
    // Set line width per zoom level
    //styleConfig.layers.iml.lines.draw.lines.width = [[5, 5000], [8, 800], [10, 200], [12, 160], [14, 60], [18, 20]];

    // Merge the style configuration back
    style.mergeConfig(styleConfig);

    // Add a tile layer to the map
    map.addLayer(new H.map.layer.TileLayer(imlProvider));
}

/**
 * Boilerplate map initialization code starts below:
 */

// Step 1: initialize communication with the platform
// In your own code, replace apikey value with your own apikey
const platform = new H.service.Platform({
    apikey: '<insert API KEY>'
});
const defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map
const map = new H.Map(
    document.getElementById('imlMap'),
    defaultLayers.vector.normal.map,
    {
        center: new H.geo.Point(54.083336, 12.108811),
        zoom: 7,
        pixelRatio: window.devicePixelRatio || 1
    }
);
// Add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Step 4: create the default UI component, for displaying bubbles
const ui = H.ui.UI.createDefault(map, defaultLayers);

// Step 5: Main logic goes here
addIml(map);
