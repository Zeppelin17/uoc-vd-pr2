import * as d3 from "d3"

export function drawRadarChart(container, data, options = {}) {
  const parentWidth = container.node().clientWidth || 340
  const size = Math.max(220, Math.min(parentWidth, 440))
  const width = size
  const height = size
  const margin = 70
  const maxValue = options.maxValue || 100
  const label = options.label || ""
  const allAxis = data.map((d) => d.axis)
  const total = allAxis.length
  const radius = Math.min(width, height) / 2 - margin
  const angleSlice = (Math.PI * 2) / total

  container.selectAll("svg").remove()
  const svg = container
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("background", "#fff")

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 38)
    .attr("text-anchor", "middle")
    .attr("font-size", size < 320 ? 15 : 22)
    .attr("font-weight", "bold")
    .text(label)

  const g = svg
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2 + 16})`)

  const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue])

  g.selectAll(".levels")
    .data(d3.range(1, 6).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", (d) => (radius * d) / 5)
    .style("fill", "#EEE")
    .style("stroke", "#BBB")
    .style("fill-opacity", 0.13)

  const axis = g
    .selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis")

  axis
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr(
      "x2",
      (d, i) => rScale(maxValue * 1.0) * Math.cos(angleSlice * i - Math.PI / 2)
    )
    .attr(
      "y2",
      (d, i) => rScale(maxValue * 1.0) * Math.sin(angleSlice * i - Math.PI / 2)
    )
    .attr("stroke", "#888")
    .attr("stroke-width", 1)

  axis
    .append("text")
    .attr("class", "legend")
    .attr("x", (d, i) => {
      const angle = angleSlice * i - Math.PI / 2
      return rScale(maxValue * 1.18) * Math.cos(angle)
    })
    .attr("y", (d, i) => {
      const angle = angleSlice * i - Math.PI / 2
      return rScale(maxValue * 1.18) * Math.sin(angle)
    })
    .style("font-size", size < 340 ? "10px" : "13px")
    .style("fill", "#222")
    .attr("text-anchor", "middle")
    .text((d) => d)

  const radarLine = d3
    .lineRadial()
    .radius((d) => rScale(d.value))
    .angle((d, i) => i * angleSlice)
    .curve(d3.curveLinearClosed)

  g.append("path")
    .datum(data)
    .attr("d", radarLine)
    .style("fill", "#FFB300")
    .style("fill-opacity", 0.5)
    .style("stroke", "#FF6F00")
    .style("stroke-width", 2)

  g.selectAll(".radarDot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "radarDot")
    .attr("r", size < 320 ? 2.5 : 4)
    .attr(
      "cx",
      (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)
    )
    .attr(
      "cy",
      (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2)
    )
    .style("fill", "#FF6F00")
    .style("stroke", "#fff")
    .style("stroke-width", 1)
}
