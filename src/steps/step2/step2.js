import * as d3 from "d3"

export function drawStep2(container, dataset) {
  const narrativeContainer = container.select(".step-narrative-container")
  const graphicContainer = container.select(".step-graphic-container")
  narrativeContainer.selectAll("*").remove()
  graphicContainer.selectAll("*").remove()

  narrativeContainer
    .append("h2")
    .text(
      "Com evoluciona la relació entre llibertat econòmica i desigualtat de gènere?"
    )
  narrativeContainer
    .append("p")
    .text(
      "Aquest gràfic mostra la trajectòria de diferents països al llarg del temps, connectant els valors de llibertat econòmica i desigualtat de gènere per a cada any disponible. Pots seleccionar un o més països, agrupats per continent, per comparar la seva evolució."
    )

  const continents = Array.from(new Set(dataset.map((d) => d.continent))).sort()
  const countriesByContinent = {}
  continents.forEach((cont) => {
    countriesByContinent[cont] = Array.from(
      new Set(dataset.filter((d) => d.continent === cont).map((d) => d.Country))
    ).sort()
  })

  const selectorsDiv = narrativeContainer
    .append("div")
    .attr("class", "selectors-row")
  selectorsDiv.append("label").text("Països:")

  const countrySelect = selectorsDiv
    .append("select")
    .attr("multiple", true)
    .attr("size", 8)
    .style("min-width", "200px")
    .style("max-width", "300px")

  const optgroups = countrySelect
    .selectAll("optgroup")
    .data(continents)
    .enter()
    .append("optgroup")
    .attr("label", (d) => d)

  optgroups.each(function (continent) {
    d3.select(this)
      .selectAll("option")
      .data(countriesByContinent[continent])
      .enter()
      .append("option")
      .attr("value", (d) => d)
      .text((d) => d)
  })

  countrySelect
    .selectAll("option")
    .property("selected", (d) => ["Spain", "France", "Germany"].includes(d))

  let selectedCountries = Array.from(countrySelect.node().selectedOptions).map(
    (opt) => opt.value
  )

  countrySelect.on("change", function () {
    selectedCountries = Array.from(this.selectedOptions).map((opt) => opt.value)
    updateChart()
  })

  updateChart()

  function updateChart() {
    graphicContainer.selectAll("*").remove()
    if (selectedCountries.length === 0) return

    const filtered = selectedCountries
      .map((country) => {
        return dataset
          .filter((d) => d.Country === country)
          .map((d) => ({
            country: d.Country,
            year: d.Year,
            economic: +d["Overall Score"],
            gender: +d.GII_value,
          }))
          .filter((d) => !isNaN(d.economic) && !isNaN(d.gender))
          .sort((a, b) => a.year - b.year)
      })
      .filter((arr) => arr.length >= 2)

    const allPoints = filtered.flat()
    const width = 380
    const height = 400
    const margin = { top: 18, right: 8, bottom: 42, left: 54 }

    const x = d3
      .scaleLinear()
      .domain(d3.extent(allPoints, (d) => d.economic))
      .range([margin.left, width - margin.right])

    const y = d3
      .scaleLinear()
      .domain(d3.extent(allPoints, (d) => d.gender))
      .range([height - margin.bottom, margin.top])

    const color = d3
      .scaleOrdinal()
      .domain(selectedCountries)
      .range(d3.schemeSet2.concat(d3.schemeSet3).concat(d3.schemeCategory10))

    const svg = graphicContainer
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%")
      .style("background", "#fff")

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(6))
      .selectAll("text")
      .style("font-size", "12px")

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 6)
      .attr("text-anchor", "middle")
      .attr("font-size", "13px")
      .text("Llibertat econòmica")

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(6))
      .selectAll("text")
      .style("font-size", "12px")

    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", 17)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("font-size", "13px")
      .text("Desigualtat de gènere")

    const line = d3
      .line()
      .x((d) => x(d.economic))
      .y((d) => y(d.gender))
      .curve(d3.curveMonotoneX)

    svg
      .selectAll(".country-line")
      .data(filtered)
      .enter()
      .append("path")
      .attr("class", "country-line")
      .attr("fill", "none")
      .attr("stroke", (d) => color(d[0].country))
      .attr("stroke-width", 2)
      .attr("opacity", 0.3)
      .attr("d", (d) => line(d))

    svg
      .selectAll(".country-dots")
      .data(filtered)
      .enter()
      .append("g")
      .attr("class", "country-dots")
      .selectAll("circle")
      .data((d) => d)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.economic))
      .attr("cy", (d) => y(d.gender))
      .attr("r", 4)
      .attr("fill", (d) => color(d.country))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.3)
      .attr("opacity", 0.78)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 8).attr("opacity", 1)
        tooltip
          .style("opacity", 1)
          .html(
            `<b>${d.country}</b><br>Any: <b>${d.year}</b><br>Llibertat econòmica: <b>${d.economic}</b><br>Desigualtat gènere: <b>${d.gender}</b>`
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
        d3.select(this).attr("r", 4).attr("opacity", 0.78)
        tooltip.style("opacity", 0)
      })

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip-step2")
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
}
