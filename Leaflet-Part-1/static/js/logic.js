let myMap = L.map("map", {
    center: [25.9408, -10.0079],
    zoom: 2
});

let earthquakeLayer = L.layerGroup().addTo(myMap);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let earthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
d3.json(earthquakes).then(function(data) {
    data.features.forEach(function(feature) {
        let coordinates = feature.geometry.coordinates;
        let magnitude = feature.properties.mag;
        let depth = coordinates[2];
        let color = getColorForDepth(depth);
        let marker = L.circleMarker([coordinates[1], coordinates[0]], {
            radius: magnitude === 0 ? 1: magnitude * 3,
            fillColor: color,
            color: "#000000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup("Location: " + feature.properties.place + "<br>Magnitude: " + magnitude + "<br>Depth: " + depth)
          .addTo(myMap);
    });

    // adding legend
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        // Define depth intervals
        let grades = [-10, 10, 30, 50, 70, 90]

        // Get corresponding colors for the intervals
        let colors = [ "#ffb3c1", "#ff758f", "#ff4d6d", "#c9184a", "#800f2f",  "#590d22"];
        // Loop through intervals and add colored squares
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML += 
                '<i style="background:' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        };
        return div;
    };
    legend.addTo(myMap);
});

function getColorForDepth(depth) {
    switch(true) {
        case depth > 90:
            return "#590d22"; 
            // 1f005c
        case depth > 70:
            return "#800f2f";
            // 5b1060
        case depth > 50:
            return "#c9184a";
            // ac255e
        case depth > 30:
            return "#ff4d6d";
            // ca485c
        case depth > 10:
            return "#ff758f";
            // e16b5c
        default:
            return "#ffb3c1";
            // ffb56b
    }
}
