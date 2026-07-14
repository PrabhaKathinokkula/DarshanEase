import { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    ResponsiveContainer
} from "recharts";
import "./Dashboard.css";

function OrganizerDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard"); 
    const [dashboard, setDashboard] = useState({ temples: 0, slots: 0, bookings: 0 });
    const [temple, setTemple] = useState(null);
    const [slots, setSlots] = useState([]);
    
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingSlotId, setEditingSlotId] = useState(null); 
    
    const [templeForm, setTempleForm] = useState({
        templeName: "", darshanStartTime: "", darshanEndTime: "", location: "", description: "", imageUrl: ""
    });
    const [slotForm, setSlotForm] = useState({
        darshanName: "", startTime: "", endTime: "", normalPrice: "", vipPrice: "", availableSeats: "100", description: ""
    });

    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        try {
            const resMetric = await axios.get("https://darshanease-8vfl.onrender.com/api/dashboard/organizer", { headers });
            setDashboard(resMetric.data);

            const resTemple = await axios.get("https://darshanease-8vfl.onrender.com/api/temples/my-temple", { headers });
            
            let activeTempleId = "6a551c1269daee5b6e3770cc";

            if (resTemple.data && resTemple.data._id) {
                setTemple(resTemple.data);
                setTempleForm({
                    templeName: resTemple.data.templeName || "",
                    darshanStartTime: resTemple.data.darshanStartTime || "",
                    darshanEndTime: resTemple.data.darshanEndTime || "",
                    location: resTemple.data.location || "",
                    description: resTemple.data.description || "",
                    imageUrl: resTemple.data.imageUrl || resTemple.data.image || "" 
                });
                activeTempleId = resTemple.data._id;
            }

            const resSlots = await axios.get(`https://darshanease-8vfl.onrender.com/api/slots/temple/${activeTempleId}`);
            setSlots(resSlots.data);

        } catch (err) {
            console.error("Organizer state build failed to safely extract maps:", err);
        }
    };

    const handleTempleUpdate = async (e) => {
        e.preventDefault();
        try {
            const endpoint = temple?._id 
                ? `https://darshanease-8vfl.onrender.com/api/temples/${temple._id}` 
                : "https://darshanease-8vfl.onrender.com/api/temples";
            
            await axios({
                method: temple?._id ? 'put' : 'post',
                url: endpoint,
                data: templeForm,
                headers
            });
            setShowUpdateForm(false);
            loadData();
            alert("Temple Settings Updated Successfully");
        } catch (err) { alert(err.message); }
    };

    const handleCreateOrUpdateSlot = async (e) => {
        e.preventDefault();
        try {
            if (editingSlotId) {
               
                await axios.put(`https://darshanease-8vfl.onrender.com/api/slots/${editingSlotId}`, {
                    ...slotForm,
                    price: slotForm.normalPrice
                }, { headers });
                alert("Darshan Slot Updated Successfully");
            } else {
               
                await axios.post("https://darshanease-8vfl.onrender.com/api/slots", { 
                    ...slotForm, 
                    templeId: temple?._id || "6a551c1269daee5b6e3770cc",
                    price: slotForm.normalPrice
                }, { headers });
                alert("Darshan Slot Created Successfully");
            }
            
            setShowCreateForm(false);
            setEditingSlotId(null);
            setSlotForm({ 
                darshanName: "", startTime: "", endTime: "", normalPrice: "", vipPrice: "", availableSeats: "100", description: "" 
            });
            loadData();
        } catch (err) { 
            alert(err.response?.data?.message || err.message); 
        }
    };

    const startEditSlot = (slot) => {
        setEditingSlotId(slot._id);
        setSlotForm({
            darshanName: slot.darshanName || "",
            startTime: slot.startTime || "",
            endTime: slot.endTime || "",
            normalPrice: slot.normalPrice !== undefined ? slot.normalPrice : (slot.price || 0),
            vipPrice: slot.vipPrice || 0,
            availableSeats: slot.availableSeats || "100",
            description: slot.description || ""
        });
        setShowCreateForm(true); // Open the workspace form container
    };

    const barChartData = [
        { name: "temples", value: dashboard.temples, fill: "#008a99" },
        { name: "darshans", value: dashboard.slots, fill: "#ff9f00" },
        { name: "bookings", value: dashboard.bookings, fill: "#008000" }
    ];

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <div className="organizer-container-root">
            <h2>Organizer Dashboard:-</h2>
            
            <div className="organizer-navbar-banner">
                <span className="nav-brand">DarshanEase(organizer)</span>
                <div className="nav-links-row">
                    <span className={activeTab === "dashboard" ? "link active" : "link"} onClick={() => { setActiveTab("dashboard"); setShowUpdateForm(false); setShowCreateForm(false); setEditingSlotId(null); }}>Dashboard</span>
                    <span className={activeTab === "my-temple" ? "link active" : "link"} onClick={() => { setActiveTab("my-temple"); setShowCreateForm(false); setEditingSlotId(null); }}>My Temple</span>
                    <span className={activeTab === "darshans" ? "link active" : "link"} onClick={() => { setActiveTab("darshans"); setShowUpdateForm(false); }}>Darshans</span>
                    <span className="link logout-tag" onClick={handleLogout}>Logout({temple?.templeName || "Tirumala"} )</span>
                </div>
            </div>

            {activeTab === "dashboard" && (
                <div className="tab-view-box gray-bg-card">
                    <h3 className="section-centered-title">DashBoard</h3>
                    
                    <div className="metric-cards-row">
                        <div className="metric-card teal-fill"><h3>Temples</h3><h1>{dashboard.temples}</h1></div>
                        <div className="metric-card orange-fill"><h3>Darshans</h3><h1>{dashboard.slots}</h1></div>
                        <div className="metric-card green-fill"><h3>Total Bookings</h3><h1>{dashboard.bookings}</h1></div>
                    </div>

                    <div className="chart-wrapper-box">
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" tickLine={false} />
                                <YAxis domain={[0, 4]} allowDecimals={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="chart-legend-row"><span className="legend-box-icon"></span> value</div>
                    </div>
                </div>
            )}

            {activeTab === "my-temple" && (
                <div className="tab-view-box">
                    {!showUpdateForm ? (
                        <div className="temple-display-layout">
                            <h3 className="section-centered-title">My Temple</h3>
                            <button className="edit-action-top-btn" onClick={() => setShowUpdateForm(true)}>Edit Temple</button>
                            
                            <div className="temple-profile-card">
                                <img 
                                    src={temple?.imageUrl || temple?.image || "/images/tirumala.jpg"} 
                                    alt="Temple Frame" 
                                    className="profile-hero-img" 
                                    onError={(e) => { e.target.src = "/images/tirumala.jpg"; }}
                                />
                                <h2>{temple?.templeName || "Tirumala's"}</h2>
                                <h4>Timing</h4>
                                <p className="timings-meta"><strong>Open:</strong> {temple?.darshanStartTime || "06:00 AM"} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Close:</strong> {temple?.darshanEndTime || "09:00 PM"}</p>
                                <p className="desc-meta"><strong>Location:</strong> {temple?.location || "N/A"}</p>
                                <p className="desc-meta"><strong>Description:</strong> {temple?.description || "N/A"}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="gradient-form-wrapper">
                            <form className="gradient-styled-panel" onSubmit={handleTempleUpdate}>
                                <h3>Update Temple</h3>
                                <label>Temple Name</label>
                                <input type="text" value={templeForm.templeName} onChange={(e) => setTempleForm({...templeForm, templeName: e.target.value})} required />
                                
                                <label>Timings</label>
                                <div className="split-form-row">
                                    <div>
                                        <span className="input-label-tag">Open</span>
                                        <input type="text" value={templeForm.darshanStartTime} onChange={(e) => setTempleForm({...templeForm, darshanStartTime: e.target.value})} required />
                                    </div>
                                    <div>
                                        <span className="input-label-tag">Close</span>
                                        <input type="text" value={templeForm.darshanEndTime} onChange={(e) => setTempleForm({...templeForm, darshanEndTime: e.target.value})} required />
                                    </div>
                                </div>

                                <label>Address</label>
                                <input type="text" value={templeForm.location} onChange={(e) => setTempleForm({...templeForm, location: e.target.value})} required />
                                
                                <label>Temple Image URL</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., /images/srisailam.jpg or online URL link" 
                                    value={templeForm.imageUrl} 
                                    onChange={(e) => setTempleForm({...templeForm, imageUrl: e.target.value})} 
                                />

                                <label>Description</label>
                                <textarea rows="3" value={templeForm.description} onChange={(e) => setTempleForm({...templeForm, description: e.target.value})} required></textarea>
                                
                                <button type="submit" className="form-submit-btn">Update</button>
                            </form>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "darshans" && (
                <div className="tab-view-box">
                    {!showCreateForm ? (
                        <div className="slots-grid-layout">
                            <div className="slots-header-action">
                                <h3 className="section-centered-title">My Darshans</h3>
                                <button className="edit-action-top-btn" onClick={() => { setEditingSlotId(null); setShowCreateForm(true); }}>Create Darshan</button>
                            </div>

                            <div className="organizer-slots-flex-row">
                                {slots.length === 0 ? (
                                    <p className="no-slots">No slots mapped to this configuration context.</p>
                                ) : (
                                    slots.map((slot) => (
                                        <div key={slot._id} className="organizer-slot-display-card">
                                            <h3><strong>Darshan Name:</strong> {slot.darshanName}</h3>
                                            <p><strong>Open:</strong> {slot.startTime}</p>
                                            <p><strong>Close:</strong> {slot.endTime}</p>
                                            <p><strong>Normal Darshan:</strong> {slot.normalPrice !== undefined ? slot.normalPrice : slot.price}</p>
                                            <p><strong>Vip Darshan:</strong> {slot.vipPrice || "0"}</p>
                                            <p className="truncated-description"><strong>Description:</strong> {slot.description}</p>
                                            
                                            {/* ACTION SELECTION BUTTON */}
                                            <button 
                                                className="slot-card-edit-btn" 
                                                onClick={() => startEditSlot(slot)}
                                            >
                                                Edit Slot
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="gradient-form-wrapper">
                            <form className="gradient-styled-panel" onSubmit={handleCreateOrUpdateSlot}>
                                <h3>{editingSlotId ? "Update Darshan" : "Create Darshan"}</h3>
                                <label>Darshan Name</label>
                                <input type="text" value={slotForm.darshanName} onChange={(e) => setSlotForm({...slotForm, darshanName: e.target.value})} required />
                                
                                <label>Timing</label>
                                <div className="split-form-row">
                                    <div>
                                        <span className="input-label-tag">open</span>
                                        <input type="text" placeholder="9.00 AM" value={slotForm.startTime} onChange={(e) => setSlotForm({...slotForm, startTime: e.target.value})} required />
                                    </div>
                                    <div>
                                        <span className="input-label-tag">close</span>
                                        <input type="text" placeholder="5.00 PM" value={slotForm.endTime} onChange={(e) => setSlotForm({...slotForm, endTime: e.target.value})} required />
                                    </div>
                                </div>

                                <label>Prices</label>
                                <div className="split-form-row">
                                    <div>
                                        <span className="input-label-tag">Normal Price</span>
                                        <input type="number" value={slotForm.normalPrice} onChange={(e) => setSlotForm({...slotForm, normalPrice: e.target.value})} required />
                                    </div>
                                    <div>
                                        <span className="input-label-tag">Vip Price</span>
                                        <input type="number" value={slotForm.vipPrice} onChange={(e) => setSlotForm({...slotForm, vipPrice: e.target.value})} required />
                                    </div>
                                </div>

                                <label>Description</label>
                                <textarea rows="3" value={slotForm.description} onChange={(e) => setSlotForm({...slotForm, description: e.target.value})} required></textarea>
                                
                                <button type="submit" className="form-submit-btn">{editingSlotId ? "Update" : "Create"}</button>
                                <button 
                                    type="button" 
                                    className="form-submit-btn" 
                                    style={{ backgroundColor: '#7f8c8d', marginTop: '10px' }} 
                                    onClick={() => { setShowCreateForm(false); setEditingSlotId(null); }}
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default OrganizerDashboard;
