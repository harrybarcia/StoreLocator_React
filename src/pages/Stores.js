import React, { useEffect } from "react";
import { useState } from "react";
import {Link} from "react-router-dom";

const AllStores = () => {
    
    const [stores, setStores] = useState([]);
    useEffect(() => {
        const fetchStores = async () => {
            // console.log("fetching");
            const response = await fetch("api");
            const data = await response.json();
            setStores(data);
        }
        fetchStores();
        
    }, []);
    console.log(stores);

    return (
        <div>
            <h1>Stores</h1>
            {stores && stores.length > 0 && stores.map((store) => (
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
                    <li >
                        {store.price}
                    </li>


                </ul>
                <button>
                    <Link to="/add-store">Add a new store</Link>
                </button>
                <button>
                    <Link to={`/edit-store/${store._id}`}>Edit my store</Link>
                </button>

            </div>
                ))
                }
            <Link to="/welcome">To welcome page</Link>
        </div>
    )

};

export default AllStores;