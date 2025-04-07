export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (timeString: string): string => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in ISO format (YYYY-MM-DD)
  const time = new Date(`${today}T${timeString}`);

  return time.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Ensures AM/PM format
  });
};


export const calculateDuration = (start: string, end: string): string => {
  // Parse the start and end times as "HH:MM"
  const [startHours, startMinutes] = start.split(':').map(Number);
  const [endHours, endMinutes] = end.split(':').map(Number);

  // Convert start and end times into minutes since the start of the day
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  // Calculate the duration in minutes
  let durationMinutes = endTotalMinutes - startTotalMinutes;

  // Handle the case where the end time is on the next day
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60; // Add 24 hours in minutes
  }

  // Convert duration back to hours and minutes
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  return `${hours}h ${minutes}m`;
};


export const calculateEndDate = (date: string, startTime: string, endTime: string): string => {
  const startDateTime = new Date(`${date}T${startTime}`);
  const endDateTime = new Date(`${date}T${endTime}`);

  // If end time is before start time, it means the trip crosses midnight
  if (endDateTime < startDateTime) {
    endDateTime.setDate(endDateTime.getDate() + 1); // Move to the next day
  }

  return formatDate(endDateTime.toISOString().split("T")[0]);
};