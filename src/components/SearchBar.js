import { get } from 'mongoose';
import React, { useEffect, useState } from 'react';


const SearchBar = (props) => {
    console.log("props", props);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(props.data? props.data : []);

const handleSubmit = (event) => {
    event.preventDefault();
    console.log("searchTerm", searchTerm);
    getResults();
    };
    results && results.length > 0 && props.func(results);

        
    
  
    const getResults = async () => {
        try {

            const response = await fetch(`http://localhost:3000/api/search/${searchTerm}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json' }
            });
            const data = await response.json();
            setResults(data);
            console.log("response", data);
        } catch (error) {
            console.error(error);
        }
    };
    


    
  

  
  console.log("results", results);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

    </div>
  );
};

export default SearchBar;
