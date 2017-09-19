export const formatTime = d3.timeFormat("%Y-%m-%d %-I:%M:%S");

export const getExtent = ({ values: { value } }) => {
  return value[0] ? value[0].intervals[0].extent : null;
};
