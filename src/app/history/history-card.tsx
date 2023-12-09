"use client";
import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import axios from "axios";
import { ContextVariables } from "../../context-variables";
import { useSearchParams } from 'next/navigation';
import AppointmentBlock from '../global/appointment-block';
import { Button, TextField, Paper, Box } from "@mui/material";
import { colorOffDark, colorOffLight, colorOffMid, buttonOffDark, buttonOffLight, buttonOffMid, buttonBlack, buttonWhite } from '@/muistyle';

//TYPESCRIPT THING
type Appointment = {
  id: number;
  status: string;
  appointmentTitle: string,
  appointmentType: string,
  mainCategory: string | null,
  subCategory: string | null,
  clientSpokenLanguage: string;
  interpreterSpokenLanguage: string;
  locationName: string | null;
  locationLatitude: number | null;
  locationLongitude: number | null;
  appointmentDateTime: Date;
};

type StatusFilter = "Requested" | "Accepted" | "Cancelled" | "Completed" | "";

export default function HistoryCard() {
  const [history, setHistory] = useState<Appointment[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredHistory, setFilteredHistory] = useState<Appointment[]>([]);
  const { userId } = useContext(ContextVariables);
  
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

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
    return history.filter((appointment) => {
      // const titleLower = eachHistory.appointmentTitle?.toLowerCase();
      // const desireLanguageLower = eachHistory.interpreterSpokenLanguage?.toLowerCase();
      // const communicateLanguageLower = eachHistory.clientSpokenLanguage?.toLowerCase();
      // const locationNameString = eachHistory.locationName?.toLowerCase();

      const searchMatch =
      String(appointment.id)
        ?.includes(searchKeyword.toLowerCase()) ||
      appointment.appointmentTitle
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase()) ||
      appointment.appointmentType
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase()) ||
      appointment.clientSpokenLanguage
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase()) ||
      appointment.interpreterSpokenLanguage
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase()) ||
      appointment.locationName
        ?.toLowerCase()
      //   .includes(searchKeyword.toLowerCase()) ||
      // appointment.locationAdress
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase()) ||
      appointment.mainCategory
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase()) ||
      appointment.subCategory
        ?.toLowerCase()
        .includes(searchKeyword.toLowerCase());     

      const statusMatch = selectedStatus === "" || appointment.status === selectedStatus;

      return searchMatch && statusMatch;
    });
  };

  useEffect(() => {
    const newFilteredHistory = getFilteredHistory();
    setFilteredHistory(newFilteredHistory);
  }, [searchKeyword, selectedStatus, history]);

  const handleStatusFilter = (status: StatusFilter) => {
    setSelectedStatus(status);
  };

  return (
    <Box className='history__card'>
      <Paper className='history__card__filter' elevation={2}>
        <div className='history__card__filter__header'>History</div>  
        <div className="history__card__filter__button-container">
          <Button
            variant="outlined"
            className="history__card__filter__button-container__button"
            sx={selectedStatus === 'Accepted' ? buttonBlack : buttonWhite}
            onClick={() => handleStatusFilter("Accepted")}
          >
            Accepted
          </Button>
          <Button
            variant="outlined"
            className="history__card__filter__button-container__button"
            sx={selectedStatus === 'Cancelled' ? buttonBlack : buttonWhite}
            onClick={() => handleStatusFilter("Cancelled")}
          >
            Cancelled
          </Button>
          <Button
            variant="outlined"
            className="history__card__filter__button-container__button"
            sx={selectedStatus === 'Completed' ? buttonBlack : buttonWhite}
            onClick={() => handleStatusFilter("Completed")}
          >
            Completed
          </Button>
          <Button
            variant="outlined"
            className="history__card__filter__button-container__button"
            sx={buttonWhite}
            onClick={() => handleStatusFilter("")}
          >
            Clear
          </Button>
        </div>
        <div className="history__card__filter__search-bar-container">
          <TextField
            variant="outlined"
            className="history__card__filter__search-bar-container__search-bar"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </Paper>
      <Paper className='history__card__appointment-container' elevation={2}>
        {filteredHistory.length !==0 ? (<AppointmentBlock appointment={filteredHistory}/>) : (
          <div>No Ongoing Appointment</div>
        )}
      </Paper>
    </Box>
  );
}
