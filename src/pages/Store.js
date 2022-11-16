import React from "react";
import { useParams } from "react-router-dom";
import './NewStoreForm.css';

const Store = () => {
    const params = useParams();
    console.log(params);

    return (
        <div id="contact">
            <h1>Store</h1>
            <h2>{params.id}</h2>
            <button name="submit" type="submit" id="contact-submit" data-submit="...Sending">Submit</button>

        </div>
    );
};

export default Store;