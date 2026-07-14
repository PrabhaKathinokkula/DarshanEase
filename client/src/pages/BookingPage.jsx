import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./BookingPage.css";

function BookingPage() {
  const { slotId } = useParams();
  const navigate = useNavigate();

  const [slot, setSlot] = useState({});
  const [tickets, setTickets] = useState(1);

  useEffect(() => {
    fetchSlot();
  }, []);

  const fetchSlot = async () => {
    try {
      const res = await API.get(`/slots/${slotId}`);
      console.log("Slot Data:", res.data);
      setSlot(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load slot details");
    }
  };

  const bookTicket = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please Login First");
      navigate("/login");
      return;
    }

    try {
      await API.post("/bookings", {
        slotId,
        noOfTickets: Number(tickets),
      });

      alert("Booking Successful");
      navigate("/bookings");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Booking Failed");
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-card">
        <h1>Confirm Booking</h1>

        <hr />

        <h2>{slot.darshanName}</h2>

        <p>
          <strong>Date:</strong>{" "}
          {slot.date
            ? new Date(slot.date).toLocaleDateString()
            : "N/A"}
        </p>

        <p>
          <strong>Time:</strong> {slot.startTime} - {slot.endTime}
        </p>

        <p>
          <strong>Normal Price:</strong> ₹ {slot.normalPrice}
        </p>

        <p>
          <strong>VIP Price:</strong> ₹ {slot.vipPrice}
        </p>

        <p>
          <strong>Available Seats:</strong> {slot.availableSeats}
        </p>

        <label>Number Of Tickets</label>

        <input
          type="number"
          min="1"
          max={slot.availableSeats || 1}
          value={tickets}
          onChange={(e) => setTickets(Number(e.target.value))}
        />

        <h2>Total Amount</h2>

        <h1>₹ {(slot.normalPrice || 0) * tickets}</h1>

        <button onClick={bookTicket}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default BookingPage;