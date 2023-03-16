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
        <div className="flex justify-center" >
            <div className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-36">
            <img src={"/images/" + store.image} />
                <h2>{params.id}</h2>
                <h2>Rating: {store.rating? store.rating.toFixed(2):"No rating yet"}</h2>
                <h2>City: {store.city}</h2>
                <StarRating
                id = {id}
                func = {pull_data}
                
                />

            </div>


        </div>
    );
};

export default Store;