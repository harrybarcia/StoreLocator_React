import React, { useState, useRef } from "react";
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
    zoom: 3.5
  });
  const mapRef = useRef();
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
    : null;

    console.log("bounds", bounds);
    

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewState.zoom,
    options: { radius: 75, maxZoom: 20 }
  });

  console.log("clusters", clusters);

  return (
    
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
              <button className="crime-marker">
                <img src="/custody.svg" alt="crime doesn't pay" />
              </button>
            </Marker>
          );
        })}
      </Map>
    
  );
}