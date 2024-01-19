      // Loop througah all properties except lon and lat and add them to the locationObject
      import React from 'react';
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
      
          const geoJSONFeature = jsonData.map((item) => {
            const coordinates = [parseFloat(item.lon), parseFloat(item.lat)];
          
            // Create an object with the "location" property
            const locationObject = {
              location: {
                coordinates: coordinates,
              },
            };
          
            // Loop through all properties except lon and lat and add them to the locationObject
            Object.keys(item).forEach((key) => {
              if (key !== 'lon' && key !== 'lat') {
                locationObject[key] = item[key];
              }
            });
          
            return locationObject;
          });
          
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
      