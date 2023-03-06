import React, { useState, useRef, useCallback, useEffect } from "react";
import useSwr from "swr";
import Map from 'react-map-gl';
import useSupercluster from "use-supercluster";
import "./pollen.css"
import "./cluster.css"
import { Marker } from "react-map-gl";
import mapboxgl from "mapbox-gl";

// import dotenv from "dotenv";
// dotenv.config({path:'../config/config.env' });
const fetcher = (...args) => fetch(...args).then(response => response.json());

// const token = process.env.token
export default function Cluster() {
  const [viewState, setViewState] = React.useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5,
    bearing: 0,
    pitch: 0
  });

  const mapRef = useRef();





  const onFlyToPress = useCallback((long, lat, zoom) => {
    mapRef.current.getMap().flyTo({
      center: [long, lat],
      zoom,
      essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
  }, []);


  const token = process.env.REACT_APP_MAPBOX_TOKEN;
  const url =
    "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson";
    console.log("url", url);
  const { data, error } = useSwr(url, { fetcher });
  const earthquakes = data && !error ? data.features : [];
  const points = earthquakes.map(earthquake => ({
    type: "Feature",
    properties: { cluster: false, id: earthquake.properties.id, tsunami: earthquake.properties.tsunami },
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(earthquake.geometry.coordinates[0]),
        parseFloat(earthquake.geometry.coordinates[1])
      ]
    }
  }));




  console.log("points", points);
  console.log("earthquakes", earthquakes);

  const bounds = mapRef.current
    ? mapRef.current
        .getMap()
        .getBounds()
        .toArray()
        .flat()
    : [-127.25474891448067, 27.492912743548914, -72.74525108551866, 50.57634666208065]
    
    ;

    console.log("mapRef.current", mapRef.current);
    console.log("mapRef.typeof", typeof(mapRef.current));


    

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewState.zoom,
    
  });

  console.log("clusters", clusters);
  console.log("supercluster", supercluster);

  

  return (
    <>
      <Map {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      ref={mapRef}
      onClick={evt => {
        const features = mapRef.current
          .getMap()
          .queryRenderedFeatures(evt.point, {
            layers: ["clusters"]
          });
        const clusterId = features;
        console.log("clusterId", clusterId);
        console.log("features", features);
        const clusterExpansionZoom = supercluster.getClusterExpansionZoom(
          clusterId
        );
        onFlyToPress(
          features[0].geometry.coordinates[0],
          features[0].geometry.coordinates[1],
          clusterExpansionZoom
        );
      }}
      >
        {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const id = cluster.properties.id;

          const tsunami = cluster.properties.tsunami === 0 ? "No" : "Yes";
          console.log("tsunami", tsunami);
          const {
            cluster: isCluster,
            point_count: pointCount
          } = cluster.properties;
          

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                latitude={latitude}
                longitude={longitude}
                ref = {mapRef}
              >
                <div
                  className="cluster-marker"
                  style={{
                    width: `${10 + (pointCount / points.length) * 20}px`,
                    height: `${10 + (pointCount / points.length) * 20}px`
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      18
                    );

                      onFlyToPress(
                        longitude,
                        latitude,
                        expansionZoom
                      );
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }
          else if (!isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                latitude={latitude}
                longitude={longitude}
                ref = {mapRef}
              >
                <div
                  className="marker-unique"
                  style={{
                    width: 3,
                    height: 3
                    
                  }}
                  onClick={() => {
                    
                    
                    const popup = new mapboxgl.Popup({ closeOnClick: false })
                    .setLngLat([longitude, latitude])
                    .setHTML(`<h3>${cluster.properties.id}</h3><p>Was there a tsunami in that spot? : ${tsunami}</p>`)
                    .addTo(mapRef.current.getMap());
                  }}
                >
                  1
                </div>
              </Marker>
            );
          }
           return (
            <Marker 
              key={`earthquake-${cluster.properties.earthquakeId}`}
              latitude={latitude}
              longitude={longitude}
            >
              <button className="point-marker">
                
              </button>
            </Marker>
          );
        })}
        
      </Map>

      </>
    
  );
}