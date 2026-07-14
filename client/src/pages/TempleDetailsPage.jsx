import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./TempleDetailsPage.css";

function TempleDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [temple, setTemple] = useState({});
    const [slots, setSlots] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        getTemple();
        getSlots();
        
        // Load logged-in user profile metrics block state values
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const getTemple = async () => {
        try {
            const res = await API.get(`/temples/${id}`);
            setTemple(res.data);
        } catch (err) { console.log(err); }
    };

    const getSlots = async () => {
        try {
            const res = await API.get(`/slots/temple/${id}`);
            setSlots(res.data);
        } catch (err) { console.log(err); }
    };

    const isOrganizer = currentUser?.role === "organizer";

    return (
        <div className="details-page">
            <div className="header-action-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 className="main-section-title">Darshans:-</h1>
                {/* Conditionally displays the action button if an organizer account matches context profile inputs */}
                {isOrganizer && (
                    <button className="create-darshan-btn" onClick={() => navigate('/slots/create')}>
                        Create Darshan
                    </button>
                )}
            </div>

            <div className="temple-info-banner">
                <div className="banner-col-desc">
                    <h2>Description</h2>
                    <p>{temple.description}</p>
                </div>
                <div className="banner-col-info">
                    <h2>Info</h2>
                    <p><strong>open:</strong> {temple.darshanStartTime}</p>
                    <p><strong>close:</strong> {temple.darshanEndTime}</p>
                    <p><strong>organizer:</strong> {temple.templeName}</p>
                    <p><strong>Address:</strong> {temple.location}</p>
                </div>
            </div>

            <h2 className="slot-title">My Darshans</h2>

            <div className="slot-container">
                {slots.length === 0 ? (
                    <h3 className="no-slots">No Slots Available</h3>
                ) : (
                    slots.map((slot) => (
                        <div className="slot-card" key={slot._id}>
                            <h3>{slot.darshanName}</h3>
                            <p><strong>Open:</strong> {slot.startTime}</p>
                            <p><strong>Close:</strong> {slot.endTime}</p>
                            <p><strong>Normal Darshan:</strong> {slot.normalPrice === 0 ? 'free' : slot.normalPrice}</p>
                            <p><strong>Vip Darshan:</strong> {slot.vipPrice === 0 ? 'N/A' : slot.vipPrice}</p>
                            <p className="slot-desc-text"><strong>Description:</strong> {slot.description}</p>

                            {isOrganizer ? (
                                <button className="edit-slot-btn" onClick={() => navigate(`/slots/edit/${slot._id}`)}>
                                    Edit Slot
                                </button>
                            ) : (
                                <button className="book-slot-btn" onClick={() => navigate(`/booking/${slot._id}`)}>
                                    Book Now
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default TempleDetailsPage;