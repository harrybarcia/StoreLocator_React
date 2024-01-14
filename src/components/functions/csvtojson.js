import React, { useState } from 'react';
import * as csvtojson from 'csvtojson';

const csvTest = (props) => {
  const handleFileChange = async () => {
    // Fetch the CSV file from the public folder
    const response = await fetch('/data.csv');
    const csvData = await response.text();

    console.log('response', response);
    console.log('csvData', csvData);

    // Convert CSV to JSON
    const jsonData = await csvtojson().fromString(csvData);
    console.log('jsonData', jsonData);

    // Assuming there's only one record in the CSV
    const geoJSONFeature = []
    jsonData.map((item, index) => {

        const { lon, lat, address } = item;
        geoJSONFeature.push(
            {
                location: {
                  coordinates: [parseFloat(lon), parseFloat(lat)],
                },
                  address: address,
              }
        )
    })

    console.log('geoJSONFeature', [geoJSONFeature]);
    props.sendDataFromChild(geoJSONFeature)
  };

  return (
    <div>
      <button onClick={handleFileChange}>Process CSV</button>
    </div>
  );
};

export default csvTest;
