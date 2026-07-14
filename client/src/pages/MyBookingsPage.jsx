import React, { useState, useEffect } from "react";
import API from "../utils/api";
import "./MyBookingsPage.css";

function MyBookingsPage() {
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/bookings/my"); 
      setBookingsList(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings records:", error);
      setLoading(false);
    }
  };

  const getExactTempleDetails = (item) => {
    const templeName = (item.templeId?.name || item.slotId?.templeId?.name || "").toLowerCase();
    const darshanName = (item.slotId?.darshanName || item.darshanName || "").toLowerCase();
    
    let displayName = item.templeId?.name || item.slotId?.templeId?.name;
    
    
    let displayImage = "/images/kasi.jpg"; 

    
    if (
      templeName.includes("hanuman") || 
      darshanName.includes("hanuman") || 
      darshanName.includes("sarva")
    ) {
      displayName = "Hanuman Temple";
      displayImage = "/images/tirumala.jpg"; 
    } else if (
      templeName.includes("kasi") || 
      templeName.includes("viswanath") || 
      darshanName.includes("divya") ||
      darshanName.includes("special")
    ) {
      displayName = "Kasi Viswanath Temple";
      displayImage = "/images/kasi.jpg"; 
    }

    if (!displayName || displayName.toLowerCase().includes("divine")) {
      displayName = darshanName.includes("sarva") ? "Hanuman Temple" : "Kasi Viswanath Temple";
    }

    return { name: displayName, image: displayImage };
  };

  return (
    <div className="history-page-root-wrapper">
      <h2 className="history-section-main-heading">My Bookings</h2>

      {loading ? (
        <p className="history-loading-msg-label">Loading your booking entries...</p>
      ) : bookingsList.length === 0 ? (
        <div className="empty-bookings-notice-box">No active bookings found.</div>
      ) : (
        <div className="history-cards-flex-stack">
          {bookingsList.map((item) => {
            const temple = getExactTempleDetails(item);
            const currentDarshanName = item.slotId?.darshanName || item.darshanName || "Darshan";
            
            return (
              <div key={item._id} className="horizontal-ticket-card-row">
                
                {/* Column 1: Uses solid local path background bindings */}
                <div 
                  className="ticket-pure-css-image-side" 
                  style={{ backgroundImage: `url(${temple.image})` }}
                  title={temple.name}
                ></div>

                {/* Column 2: Booking Id */}
                <div className="ticket-column-box text-field-column-item id-column-width-fix">
                  <label className="ticket-column-header-title">BookingId</label>
                  <p className="ticket-column-value-txt monospace-txt-layout break-all-text">
                    {item.bookingId || item._id}
                  </p>
                </div>

                {/* Column 3: Temple Name */}
                <div className="ticket-column-box text-field-column-item name-column-width-fix">
                  <label className="ticket-column-header-title">Temple Name</label>
                  <p className="ticket-column-value-txt highlight-brand-text">
                    {temple.name}
                  </p>
                </div>

                {/* Column 4: Darshan Name */}
                <div className="ticket-column-box text-field-column-item">
                  <label className="ticket-column-header-title">Darshan Name</label>
                  <p className="ticket-column-value-txt">
                    {currentDarshanName}
                  </p>
                </div>

                {/* Column 5: Booking Date */}
                <div className="ticket-column-box text-field-column-item">
                  <label className="ticket-column-header-title">BookingDate</label>
                  <p className="ticket-column-value-txt">
                    {item.bookingDate ? new Date(item.bookingDate).toLocaleDateString() : "7/14/2026"}
                  </p>
                </div>

                {/* Column 6: Darshan Timing */}
                <div className="ticket-column-box text-field-column-item">
                  <label className="ticket-column-header-title">Darshan Timing</label>
                  <p className="ticket-column-value-txt font-size-tighten">
                    {item.darshanTiming || "09:00 AM - 05:00 PM"}
                  </p>
                </div>

                {/* Column 7: No of Tickets */}
                <div className="ticket-column-box text-field-column-item text-center-alignment">
                  <label className="ticket-column-header-title">No of Tickets</label>
                  <p className="ticket-column-value-txt numeric-bold-weight">{item.noOfTickets || 1}</p>
                </div>

                {/* Column 8: Price */}
                <div className="ticket-column-box text-field-column-item text-center-alignment">
                  <label className="ticket-column-header-title">Price</label>
                  <p className="ticket-column-value-txt price-highlight-text-tint">₹{item.totalAmount || 0}</p>
                </div>

                {/* Column 9: Download Action Button */}
                <div className="ticket-column-box action-download-btn-column">
                  <button 
                    type="button"
                    onClick={() => alert(`Downloading pass pass: ${item.bookingId || item._id}`)}
                    className="ticket-download-green-action-btn"
                    title="Download Pass"
                  >
                    📥
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyBookingsPage;