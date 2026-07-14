import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
    const [temples, setTemples] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
       
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

       
      axios.get("https://darshanease-8vfl.onrender.com/api/temples", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setTemples(response.data);
        })
        .catch(err => {
            console.error("Dashboard engine failed parsing collections:", err);
            setError('Failed to display temple layout allocations.');
        });
    }, [navigate]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Available Temples</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
                {temples.map(temple => (
                    <div key={temple._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '250px' }}>
                        <h3>{temple.templeName}</h3>
                        <p><strong>Location:</strong> {temple.location}</p>
                        <p><strong>Timings:</strong> {temple.darshanStartTime} - {temple.darshanEndTime}</p>
                        <button onClick={() => navigate(`/temples/${temple._id}`)}>View Details</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserDashboard;
