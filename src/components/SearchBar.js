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
    <button type="submit" className="hover:bg-gray-200 focus:bg-gray-200 focus:outline-none">
      <SearchIcon style={{ fontSize: '48px' }}></SearchIcon>
    </button>
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
      className='rounded focus:outline-none focus:border-blue-500 transition-all duration-300 hover:border-gray-300'
    />
  </form>
</div>

  );
};

export default SearchBar;