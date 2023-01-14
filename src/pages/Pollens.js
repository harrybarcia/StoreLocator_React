import React, { useEffect } from "react";
import { useState } from "react";
import {Link} from "react-router-dom";

const AllPollens = () => {
    
    const [pollens, setPollens] = useState([]);
    useEffect(() => {
        const fetchPollens = async () => {
            // console.log("fetching");
            const response = await fetch("http://localhost:3000/pollens");
            const data = await response.json();
            setPollens(data.data);
        }
        fetchPollens();
        
    }, []);
    console.log(pollens);

    return (
        <div>
            <h1>Pollens</h1>

            {pollens && pollens.length > 0 && pollens.map((pollen) => (
            <div>
                <ul>
                    <li>
                        {pollen._id}
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