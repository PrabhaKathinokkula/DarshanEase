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
import "./AdminDashboard.css";

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard"); 
    const [metrics, setMetrics] = useState({ users: 0, organizers: 0, temples: 0, slots: 0, bookings: 0 });
    const [usersList, setUsersList] = useState([]);
    const [organizersList, setOrganizersList] = useState([]);
    const [loading, setLoading] = useState(true);

    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

    useEffect(() => {
        loadAdminData();
    }, [activeTab]);

    const loadAdminData = async () => {
        try {
            setLoading(true);
           
            const resMetric = await axios.get("  https://darshanease-8vfl.onrender.com/api/dashboard/admin", { headers });
            setMetrics(resMetric.data);

           
const resUsers = await axios.get("https://darshanease-8vfl.onrender.com/api/auth/all-users", { headers });  

            
            
            const records = resUsers.data || [];
            setUsersList(records.filter(u => u.role?.toLowerCase() === "user" || u.role?.toLowerCase() === "devotee"));
            setOrganizersList(records.filter(u => u.role?.toLowerCase() === "organizer"));

            setLoading(false);
        } catch (err) {
            console.error("Admin dashboard data sync failure:", err);
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this account configuration profile?")) {
            try {
                
                await axios.delete(` https://darshanease-8vfl.onrender.com/api/users/${userId}`, { headers });
                alert("Account Deleted Successfully");
                loadAdminData();
            } catch (err) {
                alert(err.response?.data?.message || err.message);
            }
        }
    };

   
    const barChartData = [
        { name: "Users", value: metrics.users, fill: "#884ea2" },
        { name: "Organizers", value: metrics.organizers, fill: "#0e6251" },
        { name: "temples", value: metrics.temples, fill: "#e59866" },
        { name: "Bookings", value: metrics.bookings, fill: "#196f3d" }
    ];

    return (
        <div className="admin-container-root">
            <h2 className="admin-page-main-header">Admin Dashboard Workspace</h2>
            
            {/* CLEANED SUB-MENU NAVIGATION LAYER: Merges actions cleanly without rendering an entirely separate header panel row banner */}
            <div className="admin-sub-tabs-row" style={{ display: 'flex', gap: '15px', borderBottom: '2px solid #eaeaea', paddingBottom: '10px', marginBottom: '25px' }}>
                <button className={`admin-tab-btn-item ${activeTab === 'dashboard' ? 'active-tab-highlight' : ''}`} style={{ padding: '8px 16px', cursor: 'pointer', background: activeTab === 'dashboard' ? '#008080' : '#f5f5f5', color: activeTab === 'dashboard' ? '#fff' : '#333', border: 'none', borderRadius: '4px', fontWeight: 'bold' }} onClick={() => setActiveTab("dashboard")}>Analytics Summary</button>
                <button className={`admin-tab-btn-item ${activeTab === 'users' ? 'active-tab-highlight' : ''}`} style={{ padding: '8px 16px', cursor: 'pointer', background: activeTab === 'users' ? '#008080' : '#f5f5f5', color: activeTab === 'users' ? '#fff' : '#333', border: 'none', borderRadius: '4px', fontWeight: 'bold' }} onClick={() => setActiveTab("users")}>Devotees Registry</button>
                <button className={`admin-tab-btn-item ${activeTab === 'organizers' ? 'active-tab-highlight' : ''}`} style={{ padding: '8px 16px', cursor: 'pointer', background: activeTab === 'organizers' ? '#008080' : '#f5f5f5', color: activeTab === 'organizers' ? '#fff' : '#333', border: 'none', borderRadius: '4px', fontWeight: 'bold' }} onClick={() => setActiveTab("organizers")}>Temple Organizers</button>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', marginTop: '40px', fontWeight: 'bold', color: '#666' }}>Synchronizing Application Collections Data...</p>
            ) : (
                <>
                    {/* DASHBOARD TAB CONTAINER VIEW */}
                    {activeTab === "dashboard" && (
                        <div className="admin-tab-view-box">
                            <div className="admin-metric-cards-row">
                                <div className="admin-metric-card admin-purple"><h3>USERS</h3><h1>{metrics.users}</h1></div>
                                <div className="admin-metric-card admin-teal"><h3>Organizers</h3><h1>{metrics.organizers}</h1></div>
                                <div className="admin-metric-card admin-orange"><h3>temples</h3><h1>{metrics.temples}</h1></div>
                                <div className="admin-metric-card admin-yellow"><h3>Darshans</h3><h1>{metrics.slots}</h1></div>
                                <div className="admin-metric-card admin-green"><h3>Total Bookings</h3><h1>{metrics.bookings}</h1></div>
                            </div>

                            <div className="admin-chart-wrapper-box">
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <XAxis dataKey="name" tickLine={false} />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="value" barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="admin-chart-legend-row">
                                    <span className="admin-legend-box-icon"></span> value
                                </div>
                            </div>
                        </div>
                    )}

                    {/* USERS ACCOUNT TAB CONTAINER VIEW */}
                    {activeTab === "users" && (
                        <div className="admin-tab-view-box">
                            <h3 className="admin-table-section-heading">Registered Devotees</h3>
                            <div className="admin-table-wrapper">
                                <table className="admin-data-table">
                                    <thead>
                                        <tr>
                                            <th>sl/no</th>
                                            <th>UserId</th>
                                            <th>User name</th>
                                            <th>Email</th>
                                            <th>Operation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usersList.length === 0 ? (
                                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No users registered inside database.</td></tr>
                                        ) : (
                                            usersList.map((user, idx) => (
                                                <tr key={user._id}>
                                                    <td>{idx + 1}</td>
                                                    <td className="monospace-text">{user._id}</td>
                                                    <td>{user.name || "N/A"}</td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <div className="action-buttons-flex">
                                                            <button className="delete-icon-btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleDeleteUser(user._id)}>🗑️</button>
                                                            <button className="view-details-btn">view</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ORGANIZERS TAB CONTAINER VIEW */}
                    {activeTab === "organizers" && (
                        <div className="admin-tab-view-box">
                            <h3 className="admin-table-section-heading">Registered Temple Organizers</h3>
                            <div className="admin-table-wrapper">
                                <table className="admin-data-table">
                                    <thead>
                                        <tr>
                                            <th>sl/no</th>
                                            <th>UserId</th>
                                            <th>User name</th>
                                            <th>Email</th>
                                            <th>Operation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {organizersList.length === 0 ? (
                                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No organizers registered inside database.</td></tr>
                                        ) : (
                                            organizersList.map((org, idx) => (
                                                <tr key={org._id}>
                                                    <td>{idx + 1}</td>
                                                    <td className="monospace-text">{org._id}</td>
                                                    <td>{org.name || "N/A"}</td>
                                                    <td>{org.email}</td>
                                                    <td>
                                                        <div className="action-buttons-flex">
                                                            <button className="delete-icon-btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleDeleteUser(org._id)}>🗑️</button>
                                                            <button className="view-details-btn">view</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AdminDashboard;
