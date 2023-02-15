import React from "react";
import { useParams } from "react-router-dom";
import './NewStoreForm.css';
import { useState, useEffect } from "react";

const Store = () => {
    const params = useParams();
    const id = params.id;
    console.log(params);
    console.log(id);
    const [store, setStore] = useState([]);
    useEffect(() => {
        const fetchStore = async () => {
            const response = await fetch(`/api/${id}`);
            const data = await response.json();
            setStore(data);

            
        };
        fetchStore();
    }, []);
console.log(store);
    return (
        <div id="contact">
            
            <h1>Store</h1>
            
            <h2>{params.id}</h2>
            <h2>{store.data.rating}</h2>
            

            

        </div>
    );
};

export default Store;