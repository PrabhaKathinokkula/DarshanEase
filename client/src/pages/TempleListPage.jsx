import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TempleList.css';

function TempleListPage() {
    const [temples, setTemples] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/temples')
            .then(response => {
                setTemples(response.data);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load temple configurations.');
            });
    }, []);

    return (
        <div className="temple-page-container">
            <h1 className="page-title">Available Temples</h1>
            {error && <p className="error-message">{error}</p>}
            
            <div className="temple-grid">
                {temples.map((temple) => {
                    const name = temple.templeName ? temple.templeName.toLowerCase() : '';
                    
                    let finalImage = temple.imageUrl || temple.image;

                    
                    if (
                        !finalImage || 
                        typeof finalImage !== 'string' ||
                        finalImage.trim() === "" || 
                        finalImage === "undefined" || 
                        finalImage === "null" ||
                        finalImage.includes('placeholder.jpg') 
                    ) {
                        finalImage = "";
                    }

                   
                    if (finalImage === "") {
                        if (name.includes('tirumala') || name.includes('tirmuala')) {
                            finalImage = '/images/tirumala.jpg';
                        } else if (name.includes('shirdi')) {
                            finalImage = '/images/shirdi.jpg';
                        } else if (name.includes('kasi') || name.includes('vishwanath')) {
                            finalImage = '/images/kasi.jpg';
                        } else {
                            finalImage = '/images/placeholder.jpg';
                        }
                    }

                    return (
                        <div key={temple._id} className="temple-card">
                            <div className="temple-img-wrapper">
                                <img 
                                    src={finalImage} 
                                    alt={temple.templeName} 
                                    className="temple-img" 
                                    onError={(e) => { 
                                       
                                        e.target.onerror = null; 
                                        if (name.includes('tirumala') || name.includes('tirmuala')) {
                                            e.target.src = '/images/tirumala.jpg';
                                        } else if (name.includes('shirdi')) {
                                            e.target.src = '/images/shirdi.jpg';
                                        } else if (name.includes('kasi') || name.includes('vishwanath')) {
                                            e.target.src = '/images/kasi.jpg';
                                        } else {
                                            e.target.src = '/images/placeholder.jpg';
                                        }
                                    }}
                                />
                            </div>
                            <h3 className="temple-card-title">{temple.templeName}</h3>
                            
                            <div className="timings-box">
                                <h4>Timings</h4>
                                <p><strong>Open:</strong> {temple.darshanStartTime} | <strong>Close:</strong> {temple.darshanEndTime}</p>
                            </div>
                            
                            <p className="temple-location"><strong>Location:</strong> {temple.location}</p>
                            <p className="temple-desc">{temple.description}</p>
                            
                            <button className="view-btn" onClick={() => window.location.href = `/temples/${temple._id}`}>View</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TempleListPage;