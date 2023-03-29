import React, { useState, useEffect} from "react";
import axios from "axios";

import "components/Appointment";
import "components/Application.scss";
import { getAppointmentsForDay } from "helpers/selectors";
import { getInterview } from "helpers/selectors";
import { getInterviewersForDay } from "helpers/selectors";
import DayList from "./DayList";
import Appointment from "./Appointment";



export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const dailyInterviewers = getInterviewersForDay(state, state.interviewer);
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const setDay = day => setState({ ...state, day });
  
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data}));
    })
      .catch(error => {
        console.log(error);
      });
  }, []);

  
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList 
          days={state.days} 
          value={state.day} 
          onChange={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {dailyAppointments.map(appointment => {
        const interview = getInterview(state, appointment.interview);
        return (
         <Appointment 
         key={appointment.id} 
         interview={interview}
         interviewers={dailyInterviewers}
         {...appointment} 
       />
      );
      })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
