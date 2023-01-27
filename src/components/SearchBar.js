import axios from 'axios';
import { get } from 'mongoose';
import React, { useEffect, useState } from 'react';


const SearchBar = (props) => {
    console.log("props", props);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
  const getResults = async () => {
        try {
          axios.get(`api/search/${searchTerm}`)
          .then(res => {
            console.log("res", res);
            setResults(res.data.data);
            
            console.log("results2", results);
          })
        } catch (err) {
          console.log(err);
        }
      };
      if (searchTerm !== '') {
        getResults();
      } else {
        setResults([]);
      }
  }, [searchTerm]);
  
  console.log("results3", results);

  const handleSubmit = (event) => {
    event.preventDefault();
    props.func(results)
  }
  

  return (
    <div>
      <form onSubmit={handleSubmit}  >
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
