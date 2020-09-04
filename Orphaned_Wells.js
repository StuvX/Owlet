function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'Orphaned_Wells.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

const options = {
    // Required: API key
    key: 'scLWW3eRjVaw4Oehb6WBobcQLQtbqRI4',
    verbose: true,
    lat: 54.6,
    lon: -115,
    zoom: 5,
    hourFormat: '24h',
    overlay: 'wind',
    // acTime: 'next3d',
    // numDirection: false,
    // timestamp:Date.now(),
};


// Initialize Windy API
windyInit(options, windy => {
    const {broadcast, map, store, utils} = windy;
    // const sites = {};
    const markers = {};
    const licenses = {};

    store.set('overlay', 'wind');
    store.set('level', '100m');
    // const winds = {};

    function wellStyle(intensity) {
        // var zm = map.getZoom();
        var hue = "hsl("+(90+270*intensity)+", 80%, 50%)";
        return {
            fillColor: hue,//"#ff6666",
            fillOpacity: intensity*0.9,
            color: "#00000a",
            opacity: 0.5,
            radius: 4,
            weight: 1,
        }
    }

    function wellSelectedStyle() {
        return {
            fillColor: "#ff6666",
            fillOpacity: 1,
            color: "#B04173",
            radius: 7,
        }
    }

    function wellOnEachFeature(feature, layer){
        layer.on({
            click: function(e) {
                if (selection) {
                    resetStyles();
                }
                e.target.setStyle(wellSelectedStyle());
                selection = e.target;
                selectedLayer = wellLayer;
                // Insert some HTML with the feature name
                buildSummaryLabel(feature);
                L.DomEvent.stopPropagation(e);
                // stop click event from being propagated further
            }
        });
    }

    function resetStyles(){
        if (selectedLayer === wellLayer) selection.setStyle(wellStyle());
    }
    loadJSON(function(response){
        var orphanWells = JSON.parse(response);

        for (const well of orphanWells.features) {
            let lat = well.geometry.coordinates[1];
            let lon = well.geometry.coordinates[0];
            let latlon = lat + ' ' + lon;
            let license = well.properties.Licence;
            const marker = L.circleMarker([lat, lon], wellStyle(0)).addTo(map);
            markers[latlon] = marker;
            licenses[latlon] = license;
        }
    });


    function getLatLon(latLon) {
        const parts = latLon.split(' ');
        return {lat: +parts[0], lon: +parts[1]};
    }

    function updateMarker(latlon, wind) {
        let windspd = wind.wind.toFixed(1);
        var intense;
        var power;
        if (windspd < 3.0) {
            intense = 0.;
            power = 0.;
        } else if (windspd > 24.0) {
            intense = 0.;
            power = 0.;
        } else {
            let rise = 4200*jStat.weibull.cdf(windspd,8,4.4);
            let fall = -680*windspd+17500;
            power = Math.min(rise, 4200, fall);
            intense = power/4200;
        }
        markers[latlon].setStyle(wellStyle(intense));
        let tooltip = '<div style="min-width: 50px;">License: '+ licenses[latlon]+'<br>' + windspd+ ' m/s; ' + (power/1000).toFixed(1) + ' MW </div>';
        markers[latlon].bindPopup(tooltip);
        return power;
    }

    function redraw() {
        W.tileInterpolator.createFun(interpolate => {
            let totalPower = 0;
            let numTurbines = 0;
            // var popup = null;
            for (const latlon in markers) {
                if (map.getBounds().contains(getLatLon(latlon))) {
                    let wind;
                    if (store.get('overlay') == 'wind') {
                        //If the displaed overlay is 'wind' then use it.
                        const data = interpolate(getLatLon(latlon));
                        wind = utils.wind2obj(data);
                        totalPower += updateMarker(latlon, wind);
                        numTurbines += 1;

                    }
                }
            }

            document.getElementById('windOut').innerHTML = "If there were a 4.2&nbspMW " + "<a href='https://www.vestas.com/en/products/4-mw-platform/v150-4_2_mw'>Vestas wind turbine</a>" + " at each well on the map, they would be generating "+ (totalPower/1000).toFixed(0)+ "&nbspMW, <br> with an average output of " +(totalPower/numTurbines/1000).toFixed(1) + "&nbspMW";
            document.documentElement.style.setProperty('--timing',4200/(totalPower/numTurbines).toFixed(3));
            // document.querySelector('.blades').style.timing = 8000/(totalPower/1000).toFixed(0);
            // const popLoc = map.getCenter();
            // if (popup) {
            // 	popup.setLatLng(popLoc);
            // 	popup.update();
            // } else {
            // 	popup = L.popup()
            // 			.setLatLng(popLoc)
            // 			.setContent('Total power: '+ (totalPower/1000).toFixed(0) +' MW')
            // 			.openOn(map);
            // }
        })
    }

    broadcast.on("redrawFinished", redraw);


});