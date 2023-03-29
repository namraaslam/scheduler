export function getAppointmentsForDay(state, day) {
  const findDay = state.days.find(x => x.name === day);
  if (!findDay) {
    return [];
  }
  return findDay.appointments.map(id => state.appointments[id]);
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const result = {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer]
  }
  
  return result;
}
