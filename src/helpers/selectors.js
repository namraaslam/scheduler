export function getAppointmentsForDay(state, day) {
  const findDay = state.days.find(x => x.name === day);
  if (!findDay) {
    return [];
  }
  return findDay.appointments.map(id => state.appointments[id]);
}
