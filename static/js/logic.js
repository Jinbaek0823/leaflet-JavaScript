// Initializing the map
let mapInstance = L.map("map", {
    center: [40.7608, -111.8910],
    zoom: 6
});

// Adding the base tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mapInstance);

// Function to assign colors based on earthquake depth
function assignColor(depth) {
    return depth > 90 ? "red" :
        depth > 70 ? "#FF4500" :
            depth > 50 ? "#FF8C00" :
                depth > 30 ? "#FFD700" :
                    depth > 10 ? "#98fb98" :
                        "#228b22";
}

// Function to determine circle size based on magnitude
function calculateRadius(magnitude) {
    return magnitude * 12000;
}

// Fetching earthquake data using D3
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then((data) => {
    console.log(data);

    let earthquakeData = data.features;

    // Looping through each earthquake event
    earthquakeData.forEach((quake) => {
        let coordinates = quake.geometry.coordinates;
        let magnitude = quake.properties.mag;
        let eventTime = new Date(quake.properties.time).toLocaleString();
        let lastUpdated = new Date(quake.properties.updated).toLocaleString();

        let quakeMarker = L.circle([coordinates[1], coordinates[0]], {
            color: 'black',
            fillColor: assignColor(coordinates[2]),
            fillOpacity: 0.75,
            radius: calculateRadius(magnitude),
            weight: 0.5
        }).addTo(mapInstance);

        quakeMarker.bindPopup("<strong>Location: " + quake.properties.place +
            "</strong><br /><br />Magnitude: " + magnitude +
            "<br /><br />Occurred At: " + eventTime +
            "<br /><br />Last Updated: " + lastUpdated);
    });

    // Adding a legend to the map
    let legendControl = L.control({ position: 'bottomright' });
    legendControl.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
        let depthRanges = [0, 10, 30, 50, 70, 90];
        let depthColors = ["#228b22", "#98fb98", "#FFD700", "#FF8C00", "#FF4500", "red"];

        depthRanges.forEach((limit, index) => {
            div.innerHTML += '<i style="background:' + depthColors[index] + '"></i> ' +
                limit + (depthRanges[index + 1] ? '&ndash;' + depthRanges[index + 1] + '<br>' : '+');
        });

        return div;
    };

    legendControl.addTo(mapInstance);
});
