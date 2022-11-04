import React from "react";
import { useState, useEffect } from "react";


const Users = () => {
    const [users, setUsers] = useState([]);
    console.log(typeof users);
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch("/api/users");
            const data = await response.json();
            setUsers(data);
        }   
        fetchUsers();
        console.log(users);
    }, []);
    return (
        <div>
            <h1>
                {(users && users.length > 0) ? users.map((user) => {
                    return (
                        <div>
                            <ul>
                                <li key={user._id}>
                                    {user._id}
                                </li>
                                <li>
                                    {user.email}
                                </li>
                                <li>
                                    {user.password}
                                </li>

                            </ul>
                        </div>
                    )
                })
                : <p>loading...</p>
                }
            </h1>
        </div>
    )
    
                    
}

export default Users;
