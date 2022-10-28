import React from "react";
import { useParams } from "react-router-dom";

const Store = () => {
    const params = useParams();
    console.log(params);

    return (
        <div>
            <h1>Store</h1>
            <h2>{params.id}</h2>
            <button>Delete</button>

        </div>
    );
};

export default Store;