import React from "react";
import { useParams } from "react-router-dom";
import './NewStoreForm.css';
import { useState, useEffect } from "react";
import StarRating  from "../components/StarRating";

const Store = () => {
    const params = useParams();
    const id = params.id;
    console.log(params);
    console.log(id);
    const [store, setStore] = useState([]);
    const [rating, setRating] = useState(0);
    useEffect(() => {
        const fetchStore = async () => {
            const response = await fetch(`/api/${id}`);
            const data = await response.json();
            setStore(data);
        };
        fetchStore();
    }, [rating]);
    console.log("newrating", rating);
    const pull_data = (rating) => {
        setRating(rating);
    };
    
console.log("store dans store.js", store);
    return (
        <div id="contact">
            
            <h1>Store</h1>
            
            <h2>{params.id}</h2>
            <h2>Rating: {store.rating? store.rating.toFixed(2):"No rating yet"}</h2>
            <h2>City: {store.city}</h2>
            <StarRating
            id = {id}
            func = {pull_data}
            
            />


        </div>
    );
};

export default Store;