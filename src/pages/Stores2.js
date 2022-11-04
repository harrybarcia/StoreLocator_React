import React, { useEffect } from "react";
import { useState } from "react";
import {Link} from "react-router-dom";
import EditStore from "./EditStore";
const AllStores = () => {
    
    const [stores, setStores] = useState([]);
    useEffect(() => {
        const fetchStores = async () => {
            // console.log("fetching");
            const response = await fetch("http://localhost:3000/stores2");
            const data = await response.json();
            setStores(data);
        }
        fetchStores();
        
    }, []);
    console.log(stores);

    return (
        <div>
            <h1>Stores</h1>
            {stores.map((store) => (
            <div>
                <ul>
                
                    <li key={store._id}>
                        <Link to={`/stores/${store._id}`}>{store._id}</Link>
                    </li>
                    <li >
                        {store.location.formattedAddress}
                    </li>
                    <li >
                        {store.image}
                    </li>
                </ul>
                <button>
                    <Link to="/add-store">Add a new store</Link>
                </button>
                <button>
                    <Link to={`/edit-store/${store._id}`}>Edit my store</Link>
                </button>

            </div>
                ))}
            <Link to="/welcome">To welcome page</Link>
        </div>
    )

};

export default AllStores;