import { useEffect, useState } from "react";
import API from "../utils/api";
import "./BookingHistoryPage.css";

function BookingHistoryPage() {

    const [bookings, setBookings] = useState([]);

    useEffect(() => {

        getBookings();

    }, []);

    const getBookings = async () => {

        try {

            const res = await API.get("/bookings/my");

            setBookings(res.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    const cancelBooking = async (id) => {

        const confirmCancel = window.confirm("Cancel this booking?");

        if (!confirmCancel) return;

        try {

            await API.put(`/bookings/cancel/${id}`);

            alert("Booking Cancelled Successfully");

            getBookings();

        }

        catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to Cancel Booking"
            );

        }

    };

    return (

        <div className="history-page">

            <h1>My Bookings</h1>

            {

                bookings.length === 0 ?

                    (

                        <h2>No Bookings Found</h2>

                    )

                    :

                    (

                        bookings.map((booking) => (

                            <div
                                className="booking-history-card"
                                key={booking._id}
                            >

                                <h2>

                                    {booking.slotId?.darshanName}

                                </h2>

                                <p>

                                    <strong>Temple :</strong>{" "}

                                    {booking.slotId?.templeId?.templeName}

                                </p>

                                <p>

                                    <strong>Date :</strong>{" "}

                                    {

                                        booking.slotId?.date
                                            ? new Date(
                                                booking.slotId.date
                                            ).toLocaleDateString()
                                            : ""

                                    }

                                </p>

                                <p>

                                    <strong>Time :</strong>{" "}

                                    {booking.slotId?.startTime}

                                    {" - "}

                                    {booking.slotId?.endTime}

                                </p>

                                <p>

                                    <strong>Tickets :</strong>{" "}

                                    {booking.noOfTickets}

                                </p>

                                <p>

                                    <strong>Total Amount :</strong>{" "}

                                    ₹ {booking.totalAmount}

                                </p>

                                <p>

                                    <strong>Status :</strong>{" "}

                                    <span className="status">

                                        {booking.status}

                                    </span>

                                </p>

                                {

                                    booking.status === "Booked" && (

                                        <button

                                            onClick={() =>
                                                cancelBooking(booking._id)
                                            }

                                        >

                                            Cancel Booking

                                        </button>

                                    )

                                }

                            </div>

                        ))

                    )

            }

        </div>

    );

}

export default BookingHistoryPage;