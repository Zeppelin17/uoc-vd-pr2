import * as d3 from "d3"

export function drawStep4(container, dataset) {
  const narrativeContainer = container.select(".step-narrative-container")
  const graphicContainer = container.select(".step-graphic-container")
  narrativeContainer.selectAll("*").remove()
  graphicContainer.selectAll("*").remove()

  narrativeContainer
    .append("h2")
    .text(
      "L’estat mínim: Quina relació hi ha entre la despesa pública i la llibertat econòmica?"
    )
  narrativeContainer
    .append("p")
    .text(
      "Aquest gràfic compara el nivell de despesa pública (% del PIB) amb el nivell general de llibertat econòmica. Serveix per veure si els països amb menys estat realment gaudeixen de més llibertat econòmica, o si la relació és més complexa del que diuen els models clàssics."
    )
  narrativeContainer
    .append("p")
    .text(
      "Cada punt és un país en un any concret. El color indica el continent. Pots explorar agrupacions i patrons que desafien el mite de l'estat mínim."
    )

  const continents = Array.from(new Set(dataset.map((d) => d.continent))).sort()

  const continentColors = {
    Europe: "#377eb8",
    Asia: "#e41a1c",
    Americas: "#4daf4a",
    Africa: "#984ea3",
    Oceania: "#ff7f00",
  }
  const color = (d) => continentColors[d] || "#999"

  const width = 440
  const height = 440
  const margin = { top: 40, right: 28, bottom: 48, left: 62 }

  const points = dataset
    .filter(
      (d) => !isNaN(+d["Government Spending"]) && !isNaN(+d["Overall Score"])
    )
    .map((d) => ({
      country: d.Country,
      year: d.Year,
      spending: +d["Government Spending"],
      freedom: +d["Overall Score"],
      continent: d.continent,
    }))

  const x = d3
    .scaleLinear()
    .domain(d3.extent(points, (d) => d.spending))
    .nice()
    .range([margin.left, width - margin.right])

  const y = d3
    .scaleLinear()
    .domain(d3.extent(points, (d) => d.freedom))
    .nice()
    .range([height - margin.bottom, margin.top])

  graphicContainer.style("display", "flex").style("flex-direction", "column")

  const svg = graphicContainer
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(7))
    .selectAll("text")
    .style("font-size", "12px")

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 11)
    .attr("text-anchor", "middle")
    .attr("font-size", "13px")
    .text("Despesa pública (% del PIB)")

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(7))
    .selectAll("text")
    .style("font-size", "12px")

  svg
    .append("text")
    .attr("x", -height / 2)
    .attr("y", 18)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .attr("font-size", "13px")
    .text("Llibertat econòmica (Overall Score)")

  svg
    .append("g")
    .selectAll("circle")
    .data(points)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.spending))
    .attr("cy", (d) => y(d.freedom))
    .attr("r", 5)
    .attr("fill", (d) => color(d.continent))
    .attr("opacity", 0.7)
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.2)
    .on("mouseover", function (event, d) {
      d3.select(this).attr("r", 9).attr("opacity", 1)
      tooltip
        .style("opacity", 1)
        .html(
          `<b>${d.country}</b><br>${d.year}<br>Despesa pública: <b>${d.spending}</b><br>Llibertat econòmica: <b>${d.freedom}</b>`
        )
        .style("left", event.pageX + 12 + "px")
        .style("top", event.pageY - 34 + "px")
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", event.pageX + 12 + "px")
        .style("top", event.pageY - 34 + "px")
    })
    .on("mouseout", function () {
      d3.select(this).attr("r", 5).attr("opacity", 0.7)
      tooltip.style("opacity", 0)
    })

  const legendDiv = graphicContainer
    .append("div")
    .attr("class", "step4-legend")
    .style("display", "flex")
    .style("gap", "20px")
    .style("margin-top", "18px")
    .style("justify-content", "flex-end")
    .style("align-items", "center")
    .style("width", "100%")

  continents.forEach((cont) => {
    const item = legendDiv
      .append("div")
      .style("display", "flex")
      .style("align-items", "center")
      .style("gap", "7px")
    item
      .append("span")
      .style("display", "inline-block")
      .style("width", "15px")
      .style("height", "15px")
      .style("border-radius", "50%")
      .style("background", color(cont))
      .style("border", "1.5px solid #fff")
    item
      .append("span")
      .text(cont)
      .style("font-size", "1em")
      .style("color", "#333")
  })

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip-step4")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("background", "#fff")
    .style("border", "1px solid #FFB300")
    .style("padding", "10px 13px")
    .style("font-size", "1em")
    .style("border-radius", "9px")
    .style("box-shadow", "0 2px 14px rgba(120,110,50,0.08)")
    .style("color", "#1a2540")
    .style("z-index", "9999")
}
