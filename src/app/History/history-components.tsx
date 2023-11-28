"use client";
import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import axios from "axios";
import { ContextVariables } from "../../context-variables";

//TYPESCRIPT THING
type Appointment = {
  id: number;
  status: string;
  clientUserId: number;
  clientSpokenLanguage: string;
  clientDesiredLanguage: string;
  translatorUserId: number | null;
  translatorLanguage: string | undefined;
  locationLatitude: number | null;
  locationLongitude: number | null;
  appointmentDateTime: string;
  appointmentNote: string;
  reviewRating: number | null;
  reviewNote: string | null;
  location: string | undefined;
  title: string;
  interpretationType: string;
};

type ReviewData = {
  rating: number;
  note: string;
};

type Reviews = {
  [appointmentId: string]: ReviewData;
};

type StatusFilter = "Requested" | "Accepted" | "Cancelled" | "Completed" | "";
type NewStatus = "Accepted" | "Cancelled" | "Completed";

export default function History() {
  const [history, setHistory] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState<Reviews>({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredHistory, setFilteredHistory] = useState<Appointment[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);
  const [selectedReviewRating, setSelectedReviewRating] = useState<number | null>(null);
  const [selectedReviewNote, setSelectedReviewNote] = useState<string>("");
  const { userId } = useContext(ContextVariables);

  //USEEFFECT TO GET HISTORY DATA FROM BACKEND
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          "https://senior-project-server-8090ce16e15d.herokuapp.com/appointment"
        );
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching History:", error);
      }
    };
    fetchHistory();
  }, []);

  const getFilteredHistory = () => {
    return history.filter((eachHistory) => {
      const dateTimeLower = eachHistory.appointmentDateTime.toLowerCase();
      const titleLower = eachHistory.title?.toLowerCase();
      const desireLanguageLower =
        eachHistory.clientDesiredLanguage?.toLowerCase();
      const communicateLanguageLower =
        eachHistory.clientSpokenLanguage?.toLowerCase();
      const locationString = `${eachHistory.locationLatitude}, ${eachHistory.locationLongitude}`;

      const searchMatch =
        searchTerm === "" ||
        dateTimeLower.includes(searchTerm.toLowerCase()) ||
        titleLower.includes(searchTerm.toLowerCase()) ||
        desireLanguageLower.includes(searchTerm.toLowerCase()) ||
        communicateLanguageLower.includes(searchTerm.toLowerCase()) ||
        locationString.includes(searchTerm);

      const statusMatch =
        selectedStatus === "" || eachHistory.status === selectedStatus;

      return searchMatch && statusMatch;
    });
  };

  useEffect(() => {
    const newFilteredHistory = getFilteredHistory();
    setFilteredHistory(newFilteredHistory);
  }, [searchTerm, selectedStatus, history]);

  const handleStatusFilter = (status: StatusFilter) => {
    setSelectedStatus(status);
  };












  // NOT REQUIRED ANYMORE
  const handleHistoryClick = (id: number) => {
    if (selectedHistoryId === id) {
      setSelectedHistoryId(null);
    } else {
      setSelectedHistoryId(id);
    }
  };

  const timeConvert = (isoDateString: string) => {
    const dateObject = new Date(isoDateString);
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    return formattedDate;
  };

  // const handleRatingChange = (rating: number, appointmentId: number) => {
  //   setReviews((prevReviews) => ({
  //     ...prevReviews,
  //     [appointmentId.toString()]: {
  //       ...prevReviews[appointmentId.toString()],
  //       rating,
  //     },
  //   }));
  // };



  // MIGRATE TO APPOINTMENT DETAIL
  const handleStatusChange = async (
    appointmentId: number,
    newStatus: NewStatus
  ) => {
    try {
      let url;
      switch (newStatus) {
        case "Accepted":
          url = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/accept/${appointmentId}/${userId}`;
          break;
        case "Cancelled":
          url = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/cancel/${appointmentId}`;
          break;
        case "Completed":
          url = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/complete/${appointmentId}`;
          break;
        default:
          return;
      }
      await axios.patch(url);
      alert(`Appointment ${newStatus} successfully!`);
      // Update local state
      const updatedAppointments = history.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, status: newStatus }
          : appointment
      );
      setHistory(updatedAppointments);
    } catch (error) {
      console.error(`Error updating appointment status: `, error);
      alert("Failed to update appointment status.");
    }
  };

  // const handleReviewNoteChange = (note: string, appointmentId: number) => {
  //   setReviews((prevReviews) => ({
  //     ...prevReviews,
  //     [appointmentId.toString()]: {
  //       ...prevReviews[appointmentId.toString()],
  //       note,
  //     },
  //   }));
  // };


  // const handleStatusChange = async (
  //   appointmentId: number,
  //   newStatus: NewStatus
  // ) => {
  //   try {
  //     let url;
  //     switch (newStatus) {
  //       case "Accepted":
  //         url = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/accept/${appointmentId}/${userId}`;
  //         break;
  //       case "Cancelled":
  //         url = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/cancel/${appointmentId}`;
  //         break;
  //       case "Completed":
  //         url = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/complete/${appointmentId}`;
  //         break;
  //       default:
  //         return;
  //     }
  //     await axios.patch(url);
  //     alert(`Appointment ${newStatus} successfully!`);
  //     // Update local state
  //     const updatedAppointments = history.map((appointment) =>
  //       appointment.id === appointmentId
  //         ? { ...appointment, status: newStatus }
  //         : appointment
  //     );
  //     setHistory(updatedAppointments);
  //   } catch (error) {
  //     console.error(`Error updating appointment status: `, error);
  //     alert("Failed to update appointment status.");
  //   }
  // };

  // const handleSubmitRating = async (appointmentId: number) => {
  //   try {
  //     const reviewData = reviews[appointmentId];
  //     if (!reviewData) {
  //       alert("Please provide a rating and a review note.");
  //       return;
  //     }
  //     const requestData = {
  //       reviewRating: reviewData.rating,
  //       reviewNote: reviewData.note,
  //     };
  //     await axios.patch(
  //       `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/review/${appointmentId}`,
  //       requestData
  //     );
  //     alert("Thank you for Rating!");
  //   } catch (error) {
  //     console.error("Error submitting rating:", error);
  //   }
  // };






  return (
    <div>
      <h1>History</h1>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div>
        <button
          className="history__requesting__button"
          onClick={() => handleStatusFilter("Requested")}
        >
          Requesting
        </button>
        <button
          className="history__ongoing__button"
          onClick={() => handleStatusFilter("Accepted")}
        >
          Accepted
        </button>
        <button
          className="history__cancelled__button"
          onClick={() => handleStatusFilter("Cancelled")}
        >
          Cancelled
        </button>
        <button
          className="history__completed__button"
          onClick={() => handleStatusFilter("Completed")}
        >
          Completed
        </button>
        <button
          className="history__reset__button"
          onClick={() => handleStatusFilter("")}
        >
          Clear
        </button>
      </div>
      <div className="history__container">
        {filteredHistory.map((eachHistory) => (
          <div
            key={eachHistory.id}
            className="history__list__block"
            onClick={() => handleHistoryClick(eachHistory.id)}
          >
            <p className="history__title">Title: {eachHistory.title}</p>
            <p className="history__when">
              Date and Time: {timeConvert(eachHistory.appointmentDateTime)}
            </p>
            <p className="history__status">Status: {eachHistory.status}</p>
            <p className="history__interpretationType">
              Interpretation Type: {eachHistory.interpretationType}
            </p>
            {eachHistory.location && (
              <p className="history__location">
                Location: {eachHistory.location}
              </p>
            )}








            {/* MIGRATE TO APPOINTMENT DETAIL */}
            {selectedHistoryId === eachHistory.id && (
              <div className="history__details">
              <Link href={{
                  pathname: '/appointment-detail',
                  query: {slug: eachHistory.id}
                }}><button>More Details</button></Link>

                 {/* {eachHistory.appointmentNote && (
                  <p>Appointment Note: {eachHistory.appointmentNote}</p>
                )}
                <select
                  onChange={(e) =>
                    handleRatingChange(parseInt(e.target.value), eachHistory.id)
                  }
                  value={reviews[eachHistory.id]?.rating || 0}
                >
                  <option value="0">Rate...</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <textarea
                  placeholder="Write your review note here..."
                  value={reviews[eachHistory.id]?.note || ""}
                  onChange={(e) =>
                    handleReviewNoteChange(e.target.value, eachHistory.id)
                  }
                />
                {/* change status button */}
                {/* {eachHistory.status === "Requested" && (
                  <button
                    onClick={() =>
                      handleStatusChange(eachHistory.id, "Accepted")
                    }
                  >
                    Accept
                  </button>
                )}
                {eachHistory.status === "Accepted" && (
                  <>
                    <button
                      onClick={() =>
                        handleStatusChange(eachHistory.id, "Cancelled")
                      }
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(eachHistory.id, "Completed")
                      }
                    >
                      Complete
                    </button>
                  </>
                )}
                {/* Submit button */}
                {/* <button onClick={() => handleSubmitRating(eachHistory.id)}>
                  Submit Rating
                </button>   */}
              </div>
            )}





          </div>
        ))}
      </div>
    </div>
  );
}
