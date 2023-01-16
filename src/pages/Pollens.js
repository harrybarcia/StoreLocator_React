import React, { useEffect } from "react";
import { useState } from "react";
import {Link} from "react-router-dom";

const AllPollens = () => {
    
    const [pollens, setPollens] = useState([]);
    useEffect(() => {
        const fetchPollens = async () => {
            // console.log("fetching");
            const response = await fetch("/pollens");
            const data = await response.json();
            setPollens(data.data);
        }
        fetchPollens();
        
    }, []);
    

    return (
        <div>
            <h1>Pollens</h1>

            {pollens && pollens.length > 0 && pollens.map((pollen) => (
            <div>
                <ul>
                    <li>
                        {pollen._id}
                    </li>
                    <li>
                        {pollen.province}
                    </li>
                    <li>
                        {pollen.loc.coordinates[0]} : {pollen.loc.coordinates[1]}
                    </li>
                </ul>
                <button>
                    <Link to={`/update-pollen/${pollen._id}`}>Edit my Pollen</Link>
                </button>
            </div>
                ))
                }
                :<h1>loading...</h1>


            <Link to="/welcome">To welcome page</Link>
        </div>
    )

};

export default AllPollens;