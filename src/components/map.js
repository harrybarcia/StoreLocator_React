import React, {useState, useEffect} from 'react';


const DisplayMap = () => {
    const mystyle = {
        height: "200px",
        width: "200px",
        borderStyle: "solid"};

const [backendData, setBackendData] = useState(null);
useEffect(() => {
    // declare the async data fetching function
    const fetchData = async () => {
      // get the data from the api
      const data = await fetch('/api');
      // convert the data to json
      const json = await data.json();
  
      // set state with the result
      setBackendData(json);
    }
  console.log(backendData);
    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);;
  }, [])

  return (	
    
    <div>   
        {( backendData && backendData.length > 0) ? backendData.map((store, index) => {
        
            return (
                <div>
                    <div key={index}>
                        <h1>{store.location.formattedAddress}</h1>
                        <p>{store.address}</p>
                    </div>
                    
                </div>

            );

        })
        : <p>loading...</p>
        };
        
    </div>
    );
}
export default DisplayMap;



