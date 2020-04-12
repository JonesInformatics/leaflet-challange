

  var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
// var myMap = L.map("map", {
//     center: [44.96, -93.27],
//     zoom: 2.45
//   });
  
//   L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.satellite",
//     accessToken: API_KEY
//   }).addTo(myMap);


  // Perform a GET request to the query URL
  d3.json(queryURL, function(data) {
   // Once we get a response, send the data.features object to the createFeatures function   
   createFeatures(data.features);
  });


  function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    // var earthquakes = L.geoJSON(earthquakeData, {
    //   onEachFeature: onEachFeature
    // });

    var earthquakes = L.geoJson(earthquakeData, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng)
      },
      // Style for each feature (in this case a neighborhood)
      style: function(feature) {
        return {
          color: "red",
          // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
          // fillColor: chooseColor(feature.properties.borough),

          fillOpacity: 0.5,
          weight: 1.5,
          radius: getRadius(earthquakeData[0].properties.mag)
        };
      },
      // Called on each feature
      onEachFeature: function(feature, layer) {
        // Setting various mouse events to change style when different events occur
        layer.on({
          // On mouse over, make the feature (neighborhood) more visible
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.9
            });
          },
          // Set the features style back to the way it was
          mouseout: function(event) {
            geoJson.resetStyle(event.target);
          },
          // When a feature (neighborhood) is clicked, fit that feature to the screen
          click: function(event) {
            map.fitBounds(event.target.getBounds());
          }
        });
        // Giving each feature a pop-up with information about that specific feature
        layer.bindPopup("<h1>" + feature.properties.neighborhood + "</h1> <hr> <h2>" + feature.properties.borough + "</h2>");
      }
    })
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }

  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    };
    return magnitude * 4;
  };

  function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var satMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.pirates",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.pencil",
      accessToken: API_KEY
    });

    var pirateMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",{
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Sat Map": satMap,
      "Dark Map": darkmap,
      "Pirate": pirateMap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [satMap,darkmap,pirateMap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }
  
  

//   d3.json(queryUrl, function(data) {
//     // Once we get a response, send the data.features object to the createFeatures function
//     createFeatures(data.features);
//   });
     


//       L.geoJson(data, {

//       })
//   })

//   d3.json(queryURL, data =>{
//     console.log(data);