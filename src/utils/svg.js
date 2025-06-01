import * as d3 from "d3"

export function createSVG(containerId, width = 800, height = 500) {
  const container = d3.select(containerId)
  container.select("svg").remove()

  return container
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .classed("responsive-svg", true)
}
