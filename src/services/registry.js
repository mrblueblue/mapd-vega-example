const chartGroups = new Map();

const DEFAULT = "DEFAULT";

class Registry {
  register(chart, groupName = DEFAULT) {
    return chartGroups.has(groupName)
      ? chartGroups.get(groupName).set(chart.id, chart)
      : chartGroups.set(groupName, new Map().set(chart.id, chart));
  }

  list(groupName = DEFAULT) {
    return chartGroups.has(groupName)
      ? Array.from(chartGroups.get(groupName).values())
      : [];
  }
}

export default new Registry();
