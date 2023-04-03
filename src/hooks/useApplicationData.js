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
        setState((prev) => ({
          ...prev,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const setDay = (day) => setState({ ...state, day });

  function updateSpotsRemaining(state, nameOfDay, modifier) {
    const daysArr = state.days;
    let newArr = [];

    for (const day of daysArr) {
      if (day.name === nameOfDay) {
        day.spots += modifier;
      }
      newArr.push(day);
    }
    return newArr;
  }

  function bookInterview(id, interview) {
    console.log(id, interview);
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
          days: updateSpotsRemaining(state, state.day, -1)
        });
        return response;
      });
  }

  function cancelInterview(id, interview) {
    console.log(id, interview);
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
        days: updateSpotsRemaining(state, state.day, 1)
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