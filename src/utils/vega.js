export const formatTime = d3.timeFormat("%Y-%m-%d %-I:%M:%S");

export const getExtent = ({ values: { value } }, interval = 0) => {
  return value[0] ? value[0].intervals[interval].extent : null;
};
