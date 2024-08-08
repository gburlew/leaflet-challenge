// colors range from #3A0CA3 (deepest) to #F72585 (shallowest)

// let myMap = L.map("map", {
//     center: [25.9408, -10.0079],
//     zoom: 2
// });

// let earthquakeLayer = L.layerGroup().addTo(myMap);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(myMap);

// let earthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// d3.json(earthquakes).then(function(data) {
//     data.features.forEach(function(feature) {
//         let coordinates = feature.geometry.coordinates;
//         let magnitude = feature.properties.mag;
//         let depth = coordinates[2];

//         let color = getColorForDepth(depth, data);

//         let marker = L.circleMarker([coordinates[1], coordinates[0]], {
//             radius: magnitude * 2,
//             fillColor: color,
//             color: "#000",
//             weight: 1,
//             opacity: 1,
//             fillOpacity: 0.8
//         }).bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>Magnitude: " + magnitude + "<br>Depth: " + depth + "</p>")
//           .addTo(earthquakeLayer);
//     });

//     // adding legend
//     let legend = L.control({ position: "bottomright" }); 
//     legend.onAdd = function() { 
//         let div = L.DomUtil.create("div", "info legend"); 
//         let limits = getDepthLimits(earthquakeLayer);
//         let colors = getGradientColors(limits, data);
//         let labels = []; 
//         let legendInfo = "<h1>Recorded Earthquakes from<br />the Past Week</h1>" + "<div class=\"labels\">" + "<div class=\"min\">" + limits[0] + "</div>" + "<div class=\"max\">" + limits[limits.length - 1] + "</div>" + "</div>"; 
//         div.innerHTML = legendInfo; 
//         limits.forEach(function(limit, index) { 
//             labels.push("<li style=\"background-color: " + colors[index] + "\"></li>"); 
//         }); 
//         div.innerHTML += "<ul>" + labels.join("") + "</ul>"; 
//         return div; 
//     }; 
//     legend.addTo(myMap);
// });

// function getDepthLimits(layer) {
//     let depths = [];
//     layer.eachLayer(function(marker) {
//         depths.push(marker.feature.geometry.coordinates[2]);
//     });
//     return [Math.min(...depths), Math.max(...depths)];
// }

// function getGradientColors(limits, data) {
//     const depths = data.features.map(feature => feature.geometry.coordinates[2]);
//     const minDepth = Math.min(...depths);
//     const maxDepth = Math.max(...depths);

//     // doing rgb instead of hex codes
//     const purple = [58, 12, 163];
//     const pink = [247, 37, 133];

//     // Calculate the interpolation factor based on the depth value (xpert)
//     return depths.map(depth => {
//         const factor = (depth - minDepth) / (maxDepth - minDepth);
//         // Interpolate between purple and pink based on the factor (xpert)
//         const color = [
//             Math.round((1 - factor) * pink[0] + factor * purple[0]),
//             Math.round((1 - factor) * pink[1] + factor * purple[1]),
//             Math.round((1 - factor) * pink[2] + factor * purple[2])
//         ];

//         return "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
//     });
// }

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