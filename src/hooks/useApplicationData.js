import { useState, useEffect } from "react";
import axios from "axios";


export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ])
      .then((all) => {
        setState(prev => ({
          ...prev,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        }));
      })
  }, []);

  const setDay = (day) => setState({ ...state, day });

  function updateSpotsRemaining(state, appointments) {
    const dayObject = state.days.find(x => x.name === state.day);
    let spots = 0;
    for (const id of dayObject.appointments) {
      const appointment = appointments[id];
      if (!appointment.interview) {
        spots++
      }
    }
    const day = {...dayObject, spots};
    return state.days.map(x => x.name === state.day ? day : x);
  };

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then((response) => {
        setState({
          ...state,
          appointments,
          days: updateSpotsRemaining(state, appointments)
        });
        return response;
      });
  }

  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.delete(`/api/appointments/${id}`).then((response) => {
      setState({
        ...state,
        appointments,
        days: updateSpotsRemaining(state, appointments)
      });
      return response;
    });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };

}