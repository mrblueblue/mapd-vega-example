const chartGroups = new Map();

function initializeGroup(groupName) {
  if (typeof groupName !== "string") {
    groupName = "DEFAULT";
  }

  if (!chartGroups.has(groupName)) {
    chartGroups.set(groupName, new Map());
  }

  return groupName;
}

class Registry {
  register(chart, groupName) {
    groupName = initializeGroup(groupName);
    chartGroups.get(groupName).set(chart.id, chart);
  }

  list(groupName) {
    groupName = initializeGroup(groupName);
    return Array.from(chartGroups.get(groupName).values());
  }
}

export default new Registry();
