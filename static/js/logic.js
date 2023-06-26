let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'

d3.json(url).then((response) => {
  console.log(response)
  // let Coords = [0, 0];
  // let mapZoomLevel = 0;


  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});



  let baseMaps = {
  "Street Map" : street,
  "Satellite Map" : googleSat
}

let features = response.features;
console.log(features);

let quakeMarkers = [];
let depthMarkers = [];

 
//    let bikeMarkers = []
//   // console.log(stations)

for (let i = 0; i < features.length; i++) {
  let quakelocal = features[i].geometry;

  let mag = features[i].properties.mag;
    
  let depth = quakelocal.coordinates[2];

  let quakeCoords = [quakelocal.coordinates[1], quakelocal.coordinates[0]]

  let quakeMarker = L.marker(quakeCoords).bindPopup("<h3>" + features[i].properties.title + " at time " +features[i].properties.time+"<h3><h3>Depth: " + depth + "</h3>")

  quakeMarkers.push(quakeMarker)

  let markerSZ = Math.sqrt(mag)*10;

  let markerCOL =  showCOL(depth);

  let depthMarker = L.circleMarker([quakelocal.coordinates[1], quakelocal.coordinates[0]], {
    radius: markerSZ,
    weight: 1,
    opacity: 1,
    fillColor: markerCOL,
    fillOpacity: 0.7
  }).bindPopup("<h3>" + features[i].properties.title + " at time " +features[i].properties.time+"<h3><h3>Depth: " + depth + "</h3>")

  
  depthMarkers.push(depthMarker)

}


let locations = L.layerGroup(quakeMarkers)
let depthLocations = L.layerGroup(depthMarkers)


let overlayMaps = {
  "Quake Locations" : locations
}


let myMap = L.map("map", {
  center: [40, -97],
  zoom: 1,
  layers: [street, depthLocations]
});


L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap)



function markerColor(dpth) {
  if (dpth <= 0) {
      return shade = "#ffffff"
  } else if (dpth <= 40) {
      return "#ffaaff"
  } else if (dpth <= 70) {
      return "#ff90ff"
  } else if (dpth <= 90) {
      return "#ccb3ff"
  } else if (dpth <= 170) {
    return "#8080ff"  
  } else {
    return "#0073e6"
  }
};

var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(map) {
      var div = L.DomUtil.create("div", "info legend");
      depths = [0, 40, 70, 90, 170];
      labels = [];
      legendInfo = "<strong>Depth</strong>";
      div.innerHTML = legendInfo;
      // push to labels array as list item
      for (var i = 0; i < depths.length; i++) {
          labels.push('<li style="background-color:' + markerColor(depths[i] + 1) + '"> <span>' + depths[i] + (depths[i + 1]
               ? '&ndash;' + depths[i + 1] + '' : '+') + '</span></li>');
      }
      // add label items to the div under the <ul> tag
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
  };
  // Add legend to the map
  legend.addTo(myMap);




});


 

 function showCOL(depth) {
    let colorRNGE = d3.scaleLinear()
        .domain([0, 300])
        .range(['pink', 'blue']);
        
        return colorRNGE(depth);
 }


