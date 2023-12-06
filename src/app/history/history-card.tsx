"use client";
import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import axios from "axios";
import { ContextVariables } from "../../context-variables";
import { useSearchParams } from 'next/navigation';
import AppointmentBlock from '../global/appointment-block';

//TYPESCRIPT THING
type Appointment = {
  id: number;
  status: string;
  appointmentTitle: string,
  appointmentType: string,
  clientSpokenLanguage: string;
  interpreterSpokenLanguage: string;
  locationName: string;
  locationLatitude: number;
  locationLongitude: number;
  appointmentDateTime: Date;
  locationAdress : string;
  appointmentCategory: string;
};

type StatusFilter = "Requested" | "Accepted" | "Cancelled" | "Completed" | "";

export default function HistoryCard() {
  const [history, setHistory] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredHistory, setFilteredHistory] = useState<Appointment[]>([]);
  const { userId } = useContext(ContextVariables);
  
  const searchParams = useSearchParams();
  const role = searchParams.get('slug');

  //USEEFFECT TO GET HISTORY DATA FROM BACKEND
  async function fetchHistory () {
    try {
      const timeframe = "history"; 
      const url = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/overview/${role}/${timeframe}/${userId}`;
      const response = await axios.get(url);
      // console.log(userId)
      // console.log(role)
      // console.log(url);
      console.log("history",response.data);
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching History:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  function getFilteredHistory () {
    return history.filter((eachHistory) => {
      const titleLower = eachHistory.appointmentTitle?.toLowerCase();
      const desireLanguageLower = eachHistory.interpreterSpokenLanguage?.toLowerCase();
      const communicateLanguageLower = eachHistory.clientSpokenLanguage?.toLowerCase();
      const locationNameString = eachHistory.locationName?.toLowerCase();

      const searchMatch =
      searchTerm === "" ||
      titleLower?.includes(searchTerm.toLowerCase()) ||
      desireLanguageLower?.includes(searchTerm.toLowerCase()) ||
      communicateLanguageLower?.includes(searchTerm.toLowerCase()) ||
      locationNameString?.includes(searchTerm.toLowerCase());      

      const statusMatch = selectedStatus === "" || eachHistory.status === selectedStatus;

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

  return (
    <div className='history__card'>
      <div className='history__card__header'>History</div>
      <div className='history__card__filter'>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
      <div className='history__card__appointment-container'>
        <AppointmentBlock appointment={filteredHistory}/>
      </div>
    </div>
  );
}
