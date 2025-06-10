export const plusHours = (date: Date, hours: number) => {
  const hoursAsMs = hours * 3600 * 1000;
  return new Date(date.getTime() + hoursAsMs);
};

export const plusMinutes = (date: Date, minutes: number) => {
  const minutesAsMs = minutes * 60 * 1000;
  return new Date(date.getTime() + minutesAsMs);
};
