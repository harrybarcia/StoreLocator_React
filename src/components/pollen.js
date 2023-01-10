import mapboxgl from "mapbox-gl";
import React, { useState, useEffect, useRef } from "react";
import "./pollen.css";
import { Link } from "react-router-dom";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import axios from "axios";
import { get } from "mongoose";
mapboxgl.accessToken =
  "pk.eyJ1IjoiaGFycnliYXJjaWEiLCJhIjoiY2s3dzRvdTJnMDBqODNlbzhpcjdmaGxldiJ9.vg2wE4S7o_nryVx8IFIOuQ";

const Pollen = () => {
  const mapContainer = useRef(null);
  const geocoderContainer = useRef(null);
  const [backendData, setBackendData] = useState(null);
  const [places, setPlaces] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://localhost:3000/places");
      const response = result.data;
      setPlaces(response.data);
    };
    fetchData();
  }, []);
  console.log("places", places);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current, // container id
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-73.8, 40.7],
      zoom: 9.02,
      minZoom: 3,
      maxZoom: 19,
    });

    console.log("places", places);

    function getPlaces() {
      fetch("http://localhost:3000/places")
        .then((response) => response.json())
        .then((data) => {
          loadMap(data.data);
        });
    }

    function loadMap(places) {
      map.on("load", function () {
        map.addLayer({
          id: "points",
          type: "circle",
          paint: {
            "circle-radius": 6,
            "circle-color": ["get", "color"],
          },
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: places.map((place) => {
                return {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [
                      place.loc.coordinates[0],
                      place.loc.coordinates[1],
                    ],
                  },
                  properties: { title: place.name, color: place.color },
                };
              }),
            },
          },
        });

        places.map((item, index) => {
          const el = document.createElement("div");
          el.className = 'marker';
          const width = 10;
          const height = 50;
          if (item.value === "1") {
            el.style.backgroundImage = `url(https://upload.wikimedia.org/wikipedia/commons/a/a8/Vertical_red_bar.svg)`;
          }
          else {
            el.style.backgroundImage = `url(https://placekitten.com/g/60/60/)`;

          }
          

          el.style.width = `${width}px`;
          el.style.height = `${height}px`;
          el.innerHTML = item.name;



          new mapboxgl.Marker(el)
            .setLngLat([item.loc.coordinates[0], item.loc.coordinates[1]])

            .addTo(map);
        });
      });
    }

    getPlaces();
    console.log("places", places);

    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
      })
    );

    console.log("map", map);

    const zoomThreshold = 6;
    map.on("load", function () {
      map.addSource("provinces", {
        type: "vector",
        url: "mapbox://harrybarcia.ah2i0hfc", //tilesetID
      });
      map.addLayer({
        id: "provinces",
        type: "fill",
        source: "provinces",
        "source-layer": "data2-6x12k7",
        layout: {
          visibility: "visible",
        },
        paint: {
          "fill-color": {
            type: "categorical",
            property: "PRNAME",
            stops: [
              ["Alberta", "#fbb03b"],
              ["British Columbia", "#223b53"],
              ["Manitoba", "#e55e5e"],
              ["New Brunswick", "#3bb2d0"],
              ["Newfoundland and Labrador", "#3bb2d0"],
              ["Northwest Territories", "#3bb2d0"],
              ["Nova Scotia", "#3bb2d0"],
              ["Nunavut", "#3bb2d0"],
              ["Ontario", "#3bb2d0"],
              ["Prince Edward Island", "#3bb2d0"],
              ["Quebec", "#3bb2d0"],
              ["Saskatchewan", "#3bb2d0"],
            ],
          },
          "fill-opacity": 0.5,
        },
      });
      map.addSource("points_provinces", {
        type: "geojson",
        data: "./centroides.geojson",
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });

      map.addLayer({
        id: "points_provinces",
        type: "circle",
        source: "points_provinces",
        layout: { visibility: "visible" },
        paint: { "circle-radius": 10, "circle-color": "#7C0A02" },
      });
      map.addSource("cities", {
        type: "vector",
        url: "mapbox://harrybarcia.3hys6vpn", //tilesetID
      });

      map.addLayer({
        id: "cities",
        type: "fill",
        source: "cities",
        "source-layer": "cities-a5mbav",
        layout: {
          visibility: "visible",
        },
        paint: {
          "fill-color": "#7C0A02",
          "fill-opacity": 0.5,
          "fill-outline-color": "#7C0A02",
        },
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

    const fetchData = async () => {
      const response = axios("http://localhost:3000/pollens").then(
        (response) => {
          setBackendData(response.data.data);
        }
      );
    };
    fetchData();
  }, []);

  console.log("backendData", backendData);





  return (
    <div className="map-wrapper">
      <div className="map">
        <div ref={mapContainer}></div>
      </div>
      <div className="menu" id="menu"></div>
      <div className="footer">
        {backendData && backendData.length > 0
          ? backendData.map((item, index) => {
              return (
                <div key={index}>
                  {item.province},{item.color}
                </div>
              );
            })
          : "Loading..."}
      </div>
    </div>
  );
};

export default Pollen;
