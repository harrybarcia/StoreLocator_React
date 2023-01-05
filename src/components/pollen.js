import mapboxgl from "mapbox-gl";
import React, {useState, useEffect, useRef} from "react";
import './pollen.css';
import { Link } from "react-router-dom";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
mapboxgl.accessToken = "pk.eyJ1IjoiaGFycnliYXJjaWEiLCJhIjoiY2s3dzRvdTJnMDBqODNlbzhpcjdmaGxldiJ9.vg2wE4S7o_nryVx8IFIOuQ";

const Pollen = () => {

    const mapContainer = useRef(null);
    const geocoderContainer = useRef(null);
    
    useEffect(() => {

        const map = new mapboxgl.Map({
            container: mapContainer.current, // container id
            style: 'mapbox://styles/mapbox/streets-v11',
        center: [-103,54],
        zoom :4.02,
        minZoom:3, maxZoom:19
        });
        map.addControl(
            new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
            })
            );

        console.log("map", map);

            const zoomThreshold = 6;
            map.on('load', function() {
                map.addSource('provinces', {
                    type: 'vector',
                    url: 'mapbox://harrybarcia.ah2i0hfc' //tilesetID
                });
                map.addLayer({
                    'id': 'provinces',
                    'type': 'fill',
                    'source': 'provinces',
                    'source-layer': 'data2-6x12k7',
                    'layout':{
                        'visibility':'visible'
                    } ,
                    'paint': {
                        'fill-color': {
                        'type': 'categorical',
                        'property': 'PRNAME',
                        'stops': [
                            ['Alberta', '#fbb03b'],
                            ['British Columbia', '#223b53'],
                            ['Manitoba', '#e55e5e'],
                            ['New Brunswick', '#3bb2d0'],
                            ['Newfoundland and Labrador', '#3bb2d0'],
                            ['Northwest Territories', '#3bb2d0'],
                            ['Nova Scotia', '#3bb2d0'],
                            ['Nunavut', '#3bb2d0'],
                            ['Ontario', '#3bb2d0'],
                            ['Prince Edward Island', '#3bb2d0'],
                            ['Quebec', '#3bb2d0'],
                            ['Saskatchewan', '#3bb2d0'],
                        ]
                        },
                        'fill-opacity': 0.5
                    },
                  });
                  map.addSource('points_provinces', {
                    'type': 'geojson',
                    'data': './centroides.geojson',
                    cluster: true,
                      clusterMaxZoom: 14, // Max zoom to cluster points on
                      clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
                      }
                  );
                  map.addLayer({
                    'id': 'points_provinces',
                    'type': 'circle',
                    'source': 'points_provinces',
                    'layout': {'visibility': 'visible'},
                    'paint': {'circle-radius': 10     , 'circle-color': '#7C0A02',}
                    
                  });
                map.addSource('cities', {
                    type: 'vector',
                    url: 'mapbox://harrybarcia.3hys6vpn' //tilesetID
                });
                map.addLayer({
                    'id': 'cities',
                    'type': 'fill',
                    'source': 'cities',
                    'source-layer': 'cities-a5mbav',
                    'layout':{
                        'visibility':'visible'
                    } ,
                    'paint': {
                        'fill-color': "#3bb2d0",
                        'fill-opacity': 0.5,
                        'fill-outline-color': "#000000"
                    }
                });


            });



            // After the last frame rendered before the map enters an "idle" state.
    map.on("idle", () => {
      // If these two layers were not added to the map, abort
      if (!map.getLayer("provinces") || !map.getLayer("cities")) {
        return;
      }

      // Enumerate ids of the layers.
      const toggleableLayerIds = ["provinces", "cities"];
      console.log("toggleableLayerIds", toggleableLayerIds);
      // Set up the corresponding toggle button for each layer.
      for (const id of toggleableLayerIds) {
        // Skip layers that already have a button set up.
        if (document.getElementById(id)) {
          continue;
        }

        // Create a link.
        const link = document.createElement("a");
        link.id = id;
        link.href = "#";
        link.textContent = id;
        link.className = "active";

        // Show or hide layer when the toggle is clicked.
        link.onclick = function (e) {
          const clickedLayer = this.textContent;
          console.log("clickedLayer", clickedLayer);
          e.preventDefault();
          e.stopPropagation();

          const visibility = map.getLayoutProperty(clickedLayer, "visibility");

          // Toggle layer visibility by changing the layout object's visibility property.
          if (visibility === "visible") {
            map.setLayoutProperty(clickedLayer, "visibility", "none");
            this.className = "";
          } else {
            this.className = "active";
            map.setLayoutProperty(clickedLayer, "visibility", "visible");
          }
        };

        const layers = document.getElementById("menu");
        console.log("layers", layers);
        layers.appendChild(link);
      }
    });
 
    }, []);

    

    return (


        <div className="map-wrapper">
          <div className="map">
            <div ref={mapContainer}></div>
          </div>
          <div className="menu" id="menu"></div>
         </div>
    );
};

export default Pollen;