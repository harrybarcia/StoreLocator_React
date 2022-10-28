import React from "react";
import { useParams } from "react-router-dom";

const EditStore = () => {
    const { id } = useParams();
    return (
        <div>
            <h1>Edit Store</h1>
            <p>{id}</p>
        </div>
    );
};

export default EditStore;