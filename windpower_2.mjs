
import {orphanWells} from './Orphaned_Wells.mjs';
// import "windy-plugin";
// import pluginDataLoader from 'windy';
// import store from 'windy';
// import utils from 'windy';
// import interpolator from 'windy';

// const DL_options = {
// 	key: 'scLWW3eRjVaw4Oehb6WBobcQLQtbqRI4',
//     plugin: 'Owlet.AA-CAES',
// };

const map_options = {
    key: 'scLWW3eRjVaw4Oehb6WBobcQLQtbqRI4',
    lat: 54.6,
    lon: -115.5,
    favOverlays: ['wind', 'clouds'],
    zoom: 5,
};

// var geojsonMarkerOptions = {
//     radius: 3,
//     fillColor: "#ff6666",
//     color: "#ff0000",
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.5
// };
// Major interpolation function
//
// const load = pluginDataLoader(DL_options);
//
// this.onopen = () => {
//     map.setView(map_options);
//
//     for (obj in orphanWells.features) {
//         const dataOptions = {
//             model: 'gfs',
//             lat: obj.properties.Lat,
//             lon: obj.properties.Long,
//         }
//         load('forecast', dataOptions).then(({ data }) => {
//             this.refs.forecast.innerHTML = JSON.stringify(data);
//             console.log(data);
//         })
//     }
// }


windyInit(map_options, windy => {
    const {map, store, utils} = windy;
    const markers = {};
    const winds = {};
    const forecasts = {};
    /* Same as this.onopen from https://github.com/vrana/windy-plugin-pg-mapa/blob/master/src/plugin.html except:
    interpolator -> W.tileInterpolator.createFun
    marker.on('popupopen', ) -> remove
    */
    var wellLayer;
    var selection;
    var selectedLayer;

    function wellStyle(feature) {
        return {
            fillColor: "#ff6666",
            fillOpacity: 0.3,
            color: "#B04173",
            radius: 3,
            weight: 1,
        }
    }

    function wellSelectedStyle(feature) {
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

                L.DomEvent.stopPropagation(e); // stop click event from being propagated further
            }
        });
    }

    // var wellLayer = new L.geoJSON(orphanWells, {
    //     pointToLayer: function (feature, latlng) {
    //         return L.circleMarker(latlng, wellStyle(), {riseOnHover: true});
    //     },
    //     onEachFeature: wellOnEachFeature
    // });

    // wellLayer.addTo(map);

    // Lets change layer to Wind
    // store.set('overlay', 'wind');

    // const load = pluginDataLoader(DL_options);
    //
    // for (obj in orphanWells.features) {
    //     const dataOptions = {
    //         model: 'gfs',
    //         lat: obj.properties.Lat,
    //         lon: obj.properties.Long,
    //     }
    //     load('forecast', dataOptions).then(({ data }) => {
    //         this.refs.forecast.innerHTML = JSON.stringify(data);
    //         console.log(data);
    //     })
    // }

    // // Major interpolation function
    // const interpolateValues = () => {
    //     /**
    //      * This example can interpolate only wind overlay, but
    //      * you can interpolate almost any raster layer of Windy
    //      */
    //     if (store.get('overlay') !== 'wind') {
    //         console.warn('I can iterpolate only Wind sorry');
    //         return;
    //     }
    //     /**
    //      * Interpolator returns interpolation function
    //      */
    //     interpolator(interpolate => {
    //         markers.forEach((m, i) => {
    //             // eslint-disable-next-line no-unused-vars
    //             const [name, cls, lon, lat] = points[i];
    //             /**
    //              * Interpolate finally gets you the values
    //              * @param {Object} { lat, lon }
    //              * @return {Array} array of raw meterological values or null, NaN, -1
    //              */
    //             const values = interpolate.call(interpolator, { lat, lon });
    //             /**
    //              * Remeber that we are able to interpolate values only for
    //              * points that are visible on map
    //              */
    //             if (Array.isArray(values)) {
    //                 const { wind, dir } = _.wind2obj(values);
    //                 m._icon.innerHTML = `${name}<br />${Math.round(
    //                     wind
    //                 )}m/s&nbsp;${dir}`;
    //             } else {
    //                 console.warn(
    //                     `Unable to interpolate value for ${lat}, ${lon}.`
    //                 );
    //             }
    //         });
    //     });
    // };
    //
    // interpolateValues();

    // handle clicks on the map that didn't hit a feature
    map.addEventListener('click', function(e) {
        if (selection) {
            resetStyles();
            selection = null;
            document.getElementById('summaryLabel').innerHTML = '<p>Click an orphaned well on the map to get more information.</p>';
        }
    });
    // function to set the old selected feature back to its original symbol. Used when the map or a feature is clicked.
    function resetStyles(){
        if (selectedLayer === wellLayer) selection.setStyle(wellStyle());
    }

    // fetch('https://www.paragliding-mapa.cz/api/v0.1/launch').then(response => response.json()).then(launch => {
    // 	const sites = {};
    // 	launchLoop: for (const site of launch.data) {
    // const load = pluginDataLoader(options);


    // W.tileInterpolator.createFun(interpolate => {
    //
    //     for (const obj of orphanWells.features) {
    //         let lat = obj.properties.Lat;
    //         let lon = obj.properties.Long;
    //         const data = interpolate({lat, lon});
    //         const wind_ = (data ? utils.wind2obj(data) : null);
    //         console.log(wind_);
    //         // const data = interpolate({lat,lon});
    //         // const wind_ = (data ? utils.wind2obj(data) : null);
    //         // console.log(lat+", "+lon+" "+wind_+" m/s");
    //     }
    //
    // });
    // for (const well of orphanWells.features) {
    //     let lat = well.properties.Lat;
    //     let lon = well.properties.Long;
    //     interpolator(interpolate => {
    //         const data = interpolate.call(interpolator, {lat, lon});
    //         const wind = utils.wind2obj(data);
    //     })
    //     // let data = interpolator({lat, lon});
    //     // let wind = utils.wind2obj(data);
    //     console.log(wind);
    //     // W.tileInterpolator.createFun(interpolate => {
    //     //     const data = interpolate({lat,lon});
    //     //     const wind = utils.wind2obj(data);
    //     //     console.log(wind);
    //     // })
    // }

    // let sites = {};
    // launchLoop: for (const site of orphanWells.features) {
    //     for (const lat in sites) {
    //         for (const lon in sites[lat]) {
    //             if (utils.isNear({lat, lon}, {lat: site.properties.Lat, lon: site.properties.Long})) {
    //                 sites[lat][lon].push(site);
    //                 continue launchLoop;
    //             }
    //         }
    //     }
    //     sites[site.properties.Lat] = sites[site.properties.Lat] || {};
    //     sites[site.properties.Lat][site.properties.Long] = [site];
    // };
    // console.log(sites);
    // function getTooltip(sites) {
    //     return () => {
    //         let wind;
    //         let forecast;
    //         const tooltips = sites.map(site => {
    //             wind = wind || (winds[site.latitude] && winds[site.latitude][site.longitude]);
    //             forecast = forecast || (forecasts[site.latitude] && forecasts[site.latitude][site.longitude]);
    //             return '<a href="' + site.url + '" target="_blank">' + html(site.name) + '</a> (' + site.superelevation + ' m)';
    //         });
    //         const extra = [];
    //         if (wind) {
    //             extra.push(wind);
    //         }
    //         console.log(wind);
    //         if (forecast && !/FAKE/.test(forecast.header.note)) {
    //             const path = store.get('path').replace(/\//g, '-');
    //             for (const date in forecast.data) {
    //                 if (path.startsWith(date)) {
    //                     for (const data of forecast.data[date]) {
    //                         if (data.hour == path.replace(/.*-0?/, '')) {
    //                             extra.push(data.rain ? '🌧 ' + data.mm + ' mm' : '☀');
    //                             break;
    //                         }
    //                     }
    //                     break;
    //                 }
    //             }
    //         }
    //         if (extra.length) {
    //             tooltips.push(extra.join(' '));
    //         }
    //         return '<div style="min-width: 150px;">' + tooltips.join('<br>') + '</div>';
    //     };
    // }
    //
    // for (const lat in sites) {
    //     for (const lon in sites[lat]) {
    //         const tooltip = getTooltip(sites[lat][lon]);
    //         // const icon = newIcon(getIconUrl(sites[lat][lon], null), map.getZoom());
    //         const marker = L.circleMarker([lat, lon], wellStyle(), {riseOnHover: true}).addTo(map);
    //         marker.bindPopup(tooltip);
    //         marker.on('mouseover', () => marker.openPopup());
    //         markers[lat] = markers[lat] || {};
    //         markers[lat][lon] = marker;
    //     }
    // }
    //
    // function redraw() {
    //     W.tileInterpolator.createFun(interpolate => {
    //         // for (const geo in orphanWells.features) {
    //         //     if (map.getBounds().contains(L.latLng(geo.geometry))) {
    //         //         // if (store.get('overlay') != 'wind') {
    //         //         //     break
    //         //         // } else {
    //         //         const data = interpolate(geo.geometry, 5);
    //         //         const wind_ = (data ? utils.wind2obj(data) : null);
    //         //         console.log(wind_);
    //         //         // }
    //         //     }
    //         // }
    //         for (const lat in markers) {
    //             console.log(lat);
    //             for (const lon in markers[lat]) {
    //                 console.log(lat);
    //                 if (map.getBounds().contains(L.latLng(lat, lon))) {
    //                     if (store.get('overlay') != 'wind') {
    //                         // const url = markers[lat][lon]._icon.src;
    //                         markers[lat][lon].setStyle(wellStyle());
    //                     } else {
    //                         const data = interpolate({lat, lon});
    //                         const wind = (data ? utils.wind2obj(data) : null);
    //                         console.log(wind);
    //                         // markers[lat][lon].setIcon(newIcon(getIconUrl(sites[lat][lon], wind), map.getZoom()));
    //                         winds[lat] = winds[lat] || {};
    //                         winds[lat][lon] = (wind ? wind.dir + '° ' + wind.wind.toFixed(1) + ' m/s' : '');
    //                         markers[lat][lon].setOpacity(getColor(wind) != 'red' ? 1 : .4);
    //                         markers[lat][lon].setPopupContent(getTooltip(sites[lat][lon])());
    //                     }
    //                 }
    //             }
    //         }
    //     });
    // }
    //
    // redraw();
    // // for (const obj of orphanWells.features) {
    // //     var lat = obj.properties.Lat;
    // //     var lon = obj.properties.Long;
    // //     const dataOptions = {
    // //         model: 'gfs',
    // //         lat: lat,
    // //         lon: lon,
    // //     };
    // //     load('forecast', dataOptions).then(({ data }) => {
    // //         this.refs.forecast.innerHTML = JSON.stringify(data);
    // //         console.log(data);
    // //     });
    // //     var windSpd = data.wind.wind;
    // //     console.log(windSpd);
    // // };
    //
    //
    //     // for (const lat in sites) {
    //     //     for (const lon in sites[lat]) {
    //     //         if (utils.isNear({lat, lon}, {
    //     //             lat: obj.properties.Lat,
    //     //             lon: obj.properties.Long
    //     //         })) {
    //     //             sites[lat][lon].push(obj);
    //     //         }
    //     //     }
    //     // }
    //     // sites[obj.latitude] = sites[obj.latitude] || {};
    //     // sites[obj.latitude][obj.longitude] = [obj];
    //
    //     // console.log(obj.id); )
    // // const sites = {};
    // // for (const site in orphanWells.features) {
    // //     for (const lat in sites) {
    // //         for (const lon in sites[lat]) {
    // //             if (utils.isNear({lat, lon}, {
    // //                 lat: orphanWells['properties']['Lat'],
    // //                 lon: orphanWells['properties']['Long']
    // //             })) {
    // //                 sites[lat][lon].push(site);
    // //                 // continue launchLoop;
    // //             }
    // //         }
    // //     }
    // //     sites[site.latitude] = sites[site.latitude] || {};
    // //     sites[site.latitude][site.longitude] = [site];
    // //
    // //     function getTooltip(sites) {
    // //         return () => {
    // //             let wind;
    // //             let forecast;
    // //             const tooltips = sites.map(site => {
    // //                 wind = wind || (winds[site.latitude] && winds[site.latitude][site.longitude]);
    // //                 forecast = forecast || (forecasts[site.latitude] && forecasts[site.latitude][site.longitude]);
    // //                 return '<a href="' + site.url + '" target="_blank">' + html(site.name) + '</a> (' + site.superelevation + ' m)';
    // //             });
    // //             const extra = [];
    // //             if (wind) {
    // //                 extra.push(wind);
    // //             }
    // //             if (forecast && !/FAKE/.test(forecast.header.note)) {
    // //                 const path = store.get('path').replace(/\//g, '-');
    // //                 for (const date in forecast.data) {
    // //                     if (path.startsWith(date)) {
    // //                         for (const data of forecast.data[date]) {
    // //                             if (data.hour == path.replace(/.*-0?/, '')) {
    // //                                 extra.push(data.rain ? '🌧 ' + data.mm + ' mm' : '☀');
    // //                                 break;
    // //                             }
    // //                         }
    // //                         break;
    // //                     }
    // //                 }
    // //             }
    // //             if (extra.length) {
    // //                 tooltips.push(extra.join(' '));
    // //             }
    // //             return '<div style="min-width: 150px;">' + tooltips.join('<br>') + '</div>';
    // //         };
    // //     }
    // //
    // //     for (const lat in sites) {
    // //         for (const lon in sites[lat]) {
    // //             const tooltip = getTooltip(sites[lat][lon]);
    // //             const icon = newIcon(getIconUrl(sites[lat][lon], null), map.getZoom());
    // //             const marker = L.marker([lat, lon], {icon, riseOnHover: true}).addTo(map);
    // //             marker.bindPopup(tooltip);
    // //             marker.on('mouseover', () => marker.openPopup());
    // //             markers[lat] = markers[lat] || {};
    // //             markers[lat][lon] = marker;
    // //         }
    // //     }
    // //
    // //     function redraw() {
    // //         W.tileInterpolator.createFun(interpolate => {
    // //             for (const lat in markers) {
    // //                 for (const lon in markers[lat]) {
    // //                     if (map.getBounds().contains(L.latLng(lat, lon))) {
    // //                         if (store.get('overlay') != 'wind') {
    // //                             const url = markers[lat][lon]._icon.src;
    // //                             markers[lat][lon].setIcon(newIcon(url, map.getZoom()));
    // //                         } else {
    // //                             const data = interpolate({lat, lon});
    // //                             const wind = (data ? utils.wind2obj(data) : null);
    // //                             markers[lat][lon].setIcon(newIcon(getIconUrl(sites[lat][lon], wind), map.getZoom()));
    // //                             winds[lat] = winds[lat] || {};
    // //                             winds[lat][lon] = (wind ? wind.dir + '° ' + wind.wind.toFixed(1) + ' m/s' : '');
    // //                             markers[lat][lon].setOpacity(getColor(sites[lat][lon], wind) != 'red' ? 1 : .4);
    // //                             markers[lat][lon].setPopupContent(getTooltip(sites[lat][lon])());
    // //                         }
    // //                     }
    // //                 }
    // //             }
    // //         });
    // //     }
    // //
    // //     redraw();
    // //     console.log(winds)
    // //
    // //     broadcast.on('redrawFinished', redraw);
    // // }
    // // // Same until here.
    // //
    // // windy.overlays.wind.setMetric('m/s');
    // // windy.store.set('numDirection', true);
    // //
    // //
    // function getColor(wind) {
    //     if (!wind) {
    //         // return 'white';
    //         let color = 'white'
    //     }
    //     if (wind.wind.toFixed(1) >= 8) {
    //         // return 'red';
    //         let color = 'red'
    //     }
    //
    //     if (wind.wind.toFixed(1) >= 4) {
    //
    //             let color = 'yellow';
    //         }
    //
    //     return color;
    // }
    //
    // function isDirIn(dir, from, to, tolerance = 0) {
    //     to += (to < from ? 360 : 0);
    //     return (dir >= from - tolerance && dir <= to + tolerance) || dir <= to + tolerance - 360 || dir >= from - tolerance + 360;
    // }
    // //
    // // function getIconUrl(sites, wind) {
    // //     let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38">\n';
    // //     for (const site of sites) {
    // //         svg += getCircleSlice(site.wind_usable_from - 90, site.wind_usable_to - 90, 38, getColor([site], wind)) + '\n';
    // //     }
    // //     svg += '<circle cx="19" cy="19" r="18" stroke="white" stroke-width="2" fill-opacity="0"/>\n</svg>';
    // //     return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    // // }
    // //
    // // function newIcon(url, zoom) {
    // //     const size = zoom > 9 ? 38 : zoom > 6 ? 19 : zoom > 4 ? 9 : 5;
    // //     return L.icon({
    // //         iconUrl: url,
    // //         iconSize: [size, size],
    // //         iconAnchor: [(size - 1) / 2, (size - 1) / 2],
    // //     });
    // // }
    // //
    // // function getCircleSlice(startAngle, endAngle, size, color) {
    // //     const hSize = size / 2;
    // //     const x1 = Math.round(hSize + hSize * Math.cos(Math.PI * startAngle / 180));
    // //     const y1 = Math.round(hSize + hSize * Math.sin(Math.PI * startAngle / 180));
    // //     const x2 = Math.round(hSize + hSize * Math.cos(Math.PI * endAngle / 180));
    // //     const y2 = Math.round(hSize + hSize * Math.sin(Math.PI * endAngle / 180));
    // //     return "<path d='M" + hSize + "," + hSize + " L" + x1 + "," + y1 + " A" + hSize + "," + hSize + " 0 0,1 " + x2 + "," + y2 + " z' fill='" + color + "'/>";
    // // }
    // //
    // // function html(s) {
    // //     return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    // // }
})