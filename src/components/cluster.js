import React, { useState, useRef, useCallback } from "react";
import useSwr from "swr";
import Map from 'react-map-gl';
import useSupercluster from "use-supercluster";
import "./pollen.css"
import "./cluster.css"
import { Marker } from "react-map-gl";



// import dotenv from "dotenv";
// dotenv.config({path:'../config/config.env' });
const fetcher = (...args) => fetch(...args).then(response => response.json());
// const token = process.env.token
export default function Cluster() {
  const [viewState, setViewState] = React.useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5,
    
    
  });

  
  const mapRef = useRef();

  const onFlyToPress = useCallback((long, lat, zoom) => {
    mapRef.current.getMap().flyTo({
      

      center: [long, lat],
      zoom,
      essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
  }, []);

  
  
  
  const token = "pk.eyJ1IjoiaGFycnliYXJjaWEiLCJhIjoiY2s3dzRvdTJnMDBqODNlbzhpcjdmaGxldiJ9.vg2wE4S7o_nryVx8IFIOuQ";
  const url =
    "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson";
    console.log("url", url);
  const { data, error } = useSwr(url, { fetcher });
  const earthquakes = data && !error ? data.features : [];
  const points = earthquakes.map(earthquake => ({
    type: "Feature",
    properties: { cluster: false, id: earthquake.id, category: earthquake.tsunami },
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

    console.log("bounds", bounds);
    

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewState.zoom,
    
  });

  console.log("clusters", clusters);
  console.log("supercluster", supercluster);

  return (
    <>
      <Map   {...viewState}
      
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v9"
        
        ref={mapRef}
          
        

      >
        {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates;
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
                      20
                    );
                    
                    // setViewState({
                    //   ...viewState,
                    //   latitude,
                    //   longitude,
                    //   zoom: expansionZoom,


                      
                    //   });
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