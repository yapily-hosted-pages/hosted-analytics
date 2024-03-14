export const daysToRange = (n) => {
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);
  endDate.setDate(endDate.getDate());

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - n);

  return {
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  };
};
