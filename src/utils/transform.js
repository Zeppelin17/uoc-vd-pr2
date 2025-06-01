export function prepareRadarData(entry, variables) {
  return variables.map((axis) => ({
    axis,
    value: entry[axis] && entry[axis] !== "N/A" ? +entry[axis] : 0,
  }))
}
