import axios from 'axios';
import { get } from 'mongoose';
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const search = searchTerm.toLowerCase();
    if (searchTerm.trim() !== '') {
    axios.get(`/search/${search}`)
      .then((res) => {
        setResults(res.data.data);
      });
    }

    if (searchTerm === '') {
      axios.get(`/allStores`)
        .then((res) => {
          setResults(res.data);
        });
    }
  }, [searchTerm]);

  const handleSubmit = (event) => {
    event.preventDefault();
    props.func(results);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className='flex flex-row items-center'>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button type="submit">
          <SearchIcon
          style={{ fontSize: '48px' }}
          ></SearchIcon>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;