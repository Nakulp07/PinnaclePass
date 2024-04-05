import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormatDateTime from "../components/date";
import "../styles/Seating.css";

const Seating = (props) => {
  const { _id } = useParams();
  let myseats;
  // const date = new Date();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [show, setShow] = useState([]);
  const seatPrice = 100; //price hardcode ahe te change karayla lagnar

  const handleBookNowClick = async () => {
    try {
      const amount = seatPrice * 100 * selectedSeats.length; // You can set the amount dynamically or fetch it from somewhere
      const response = await axios.post("/api/payment/makePayment", { amount });
      const paymentUrl = response.data; // Assuming redirectUrl is provided in the response

      // Redirect to the payment URL
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  const reserveSeats = async (seats) => {
    // console.log(seats);
    try {
      for (var i = 0; i < seats.length; i++) {
        // console.log(_id);
        const response = await axios.patch(
          `/api/seat/patchseatsbyshowId/${_id}`,
          { _id, seatNumber: seats[i] }
        );
        // console.log(response.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await axios.get(`/api/show/getShow/${_id}`);
        setShow(response.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    if (_id) {
      fetchShow();
    }
  }, [_id]);

  const handleSeatClick = (seat) => {

    if (selectedSeats.includes(seat.seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.seatNumber));
    } else if (seat.isBooked == true) {
      alert("seat is reserved");
    } else {
      setSelectedSeats([...selectedSeats, seat.seatNumber]);
    }
  };

  const calculateTotalPrice = () => {
    return selectedSeats.length * seatPrice;
  };

  const fetchSeatsByShowId = async (showId) => {
    try {
      const response = await fetch(`/api/seat/getseatsbyshowId/${showId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch seats");
      }

      const seats = await response.json();

      return seats;
    } catch (error) {
      console.error("Error fetching seats:", error.message);
      return [];
    }
  };

  const [seats, setSeats] = useState([]);

  useEffect(() => {
    const showId = _id; //
    const fetchData = async () => {
      const seatsData = await fetchSeatsByShowId(showId);
      setSeats(seatsData);
    };
    fetchData();
  }, [_id]);

  return (
    <div className="seating">
      <h2>Select Your Seats</h2>
      <div className="seat-container">
        <div className="seat-grid">
          {seats.map((seat) => (
            <div
              key={seat._id}
              className={`seat ${
                selectedSeats.includes(seat.seatNumber) ? "selected" : ""
              } ${seat.isBooked ? "reserved" : ""}`}
              onClick={() => handleSeatClick(seat)}
            >
              {seat.seatNumber}
            </div>
          ))}
        </div>
      </div>
      <div className="seats-screen">
        <div className="seat-screen-light"></div>
        <div className="seat-screen-div"></div>
      </div>
      <div className="selected-seats">
        <p>Selected Seats: {selectedSeats.join(", ")}</p>
        {show[0] ? (
          <p>Time:{FormatDateTime(show[0].startTime)}</p>
        ) : (
          <p>Loading</p>
        )}
        {/* <p>Time of Show: </p> */}
        <p>Total Price: ₹{calculateTotalPrice()}</p>
      </div>
      <button onClick={() => reserveSeats(selectedSeats)}>Book Now</button>

      {/* <div className="timings">
        <div className="dates">{renderDates()}</div>
        <div className="times">{renderTimes()}</div>
      </div> */}
    </div>
  );
};

export default Seating;

// const renderTimes = () => {
//   const times = ["11:00", "14:30", "18:00", "21:30"];
//   return times.map((time, index) => (
//     <div key={index}>
//       <input
//         className="seat-button"
//         type="radio"
//         name="time"
//         id={`t${index + 1}`}
//         defaultChecked={index === 0}
//         // onChange={() => setSelectedTime(time)}
//       />
//       <label htmlFor={`t${index + 1}`} className="time">
//         {time}
//       </label>
//     </div>
//   ));
// };

// useEffect(() => {
//   const fetchShow = async () => {
//     try {
//       const response = await axios.get(`/api/show/getShow/${_id}`);
//       setShow(response.data);
//     } catch (error) {
//       console.error("Error fetching movie:", error);
//     }
//   };
//   fetchShow(_id);
//   console.log(show);
// }, [show, _id]);
