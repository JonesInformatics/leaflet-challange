var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// make GET request to the query URL
d3.json(queryUrl, function(data) {
    createFeatures(data.features);
    console.log(data.features)
  });
  
  //features function
  function createFeatures(earthquakeData) {
  
   //make colors based on the magnitude
  function CirColor(mag){
    if (mag < 1) {
      return "yellow"
    }
    else if (mag < 2) {
      return "green"
    }
    else if (mag < 3) {
      return "purple"
    }
    else if (mag < 4) {
      return "blue"
    }
    else if (mag < 5) {
      return "red"
    }
    else {
      return "white"
    }
  }
  
  // fucntion for feture and pop-ups
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
  
  //geoJson layers
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
      return L.circle(latlng, {
        radius: earthquakeData.properties.mag * 10000,
        color: CirColor(earthquakeData.properties.mag),
        fillOpacity: .70
      });
    },
    onEachFeature: onEachFeature
  });
  
  
  createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
  // darkmap layer
    
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
     maxZoom: 16,
     id: "mapbox.dark",
     accessToken: API_KEY
    });
  
  
  
  // baseMap
    var baseMaps = {
      
      
      "Dark Map": darkmap
    
    };
  
  // overlay object
    var overlayMaps = {
     Earthquakes: earthquakes
    };
  
  // create map
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 4,
      layers: [darkmap, earthquakes]
    });
  
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
     collapsed: false
    }).addTo(myMap);
  
    
    
  //create legend 
  
    var legend = L.control({position: 'topright'});
  
  //function to make legend
    function legColor(d) {
      return d > 5 ? 'red' :
           d > 4  ? 'blue' :
           d > 3  ? 'purple' :
           d > 2  ? 'green' :
           d > 1  ? 'yellow' :
                  'white' ;
    };
  
  // 
    legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          mags = [0, 1, 2, 3, 4, 5]
    
      for (var i = 0; i < mags.length; i++) {
          div.innerHTML +=
              '<i style="background:' + legColor(mags[i] + 1) + '"></i> ' +
              mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
       }
  
        return div;
    };
  
    legend.addTo(myMap);
  }