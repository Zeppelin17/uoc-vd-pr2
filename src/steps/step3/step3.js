import * as d3 from "d3"

export function drawStep3(container, dataset) {
  const narrativeTop = container.select(".step3-narrative-top")
  const heatmapContainer = container.select(".step3-heatmap-container")
  narrativeTop.selectAll("*").remove()
  heatmapContainer.selectAll("*").remove()

  narrativeTop
    .append("h2")
    .text("Canvi interanual: llibertat econòmica i desigualtat de gènere")
  narrativeTop
    .append("p")
    .text(
      "Aquest gràfic mostra, per a cada país i any, si la situació ha millorat o empitjorat respecte a l'any anterior. El color blau assenyala millores clares (més llibertat econòmica o menys desigualtat), el vermell empitjoraments, i els tons grocs i neutres marquen estabilitat. Així pots veure fàcilment quins països han progressat, retrocedit o s'han mantingut estables al llarg del temps."
    )

  const years = Array.from(new Set(dataset.map((d) => +d.Year))).sort(
    (a, b) => a - b
  )
  const continents = Array.from(new Set(dataset.map((d) => d.continent))).sort()
  const countriesByContinent = {}
  continents.forEach((cont) => {
    countriesByContinent[cont] = Array.from(
      new Set(dataset.filter((d) => d.continent === cont).map((d) => d.Country))
    ).sort()
  })

  const selectorRow = narrativeTop
    .append("div")
    .attr("class", "step3-selectors-row")
    .style("margin-bottom", "24px")
    .style("display", "flex")
    .style("gap", "14px")
    .style("align-items", "center")

  selectorRow
    .append("label")
    .style("font-weight", "bold")
    .style("font-size", "1.05em")
    .text("Països:")

  const countrySelect = selectorRow
    .append("select")
    .attr("multiple", true)
    .attr("size", 8)
    .style("min-width", "200px")
    .style("max-width", "350px")
    .style("font-size", "1em")
    .style("border-radius", "8px")

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

  function calcDelta(data, key, selectedCountries) {
    const byCountry = d3.group(
      data.filter((d) => selectedCountries.includes(d.Country)),
      (d) => d.Country
    )
    return selectedCountries.map((country) => {
      const series = (byCountry.get(country) || []).sort(
        (a, b) => +a.Year - +b.Year
      )
      return years.map((year, i) => {
        if (i === 0 || !series[i] || !series[i - 1])
          return { delta: null, value: null }
        const curr = +series[i]?.[key]
        const prev = +series[i - 1]?.[key]
        if (isNaN(curr) || isNaN(prev)) return { delta: null, value: null }
        return { delta: curr - prev, value: curr }
      })
    })
  }

  function updateChart() {
    heatmapContainer.selectAll("*").remove()
    if (selectedCountries.length === 0) return

    const countries = selectedCountries
    const deltaFreedom = calcDelta(dataset, "Overall Score", countries)
    const deltaGender = calcDelta(dataset, "GII_value", countries)

    const cellSize = 32
    const labelWidth = 120
    const width = labelWidth + years.length * cellSize + 90
    const heatmapHeight = countries.length * cellSize + 120
    const totalHeight = heatmapHeight * 2 + 80

    const colorFreedom = d3
      .scaleDiverging()
      .domain([-4, 0, 4])
      .interpolator(d3.interpolateRdYlBu)

    const colorGender = d3
      .scaleDiverging()
      .domain([0.03, 0, -0.03])
      .interpolator(d3.interpolateRdYlBu)

    const scrollDiv = heatmapContainer
      .append("div")
      .style("overflow-x", "auto")
      .style("width", "100%")
      .style("max-width", "99vw")
      .style("margin", "0 auto")

    const svg = scrollDiv
      .append("svg")
      .attr("width", width)
      .attr("height", totalHeight)
      .style("background", "#fff")

    svg
      .append("text")
      .attr("x", labelWidth + (years.length * cellSize) / 2)
      .attr("y", 12)
      .attr("text-anchor", "middle")
      .attr("font-size", "1.12em")
      .attr("font-weight", "bold")
      .text("Variació interanual en llibertat econòmica")

    svg
      .append("g")
      .selectAll("text")
      .data(years)
      .enter()
      .append("text")
      .attr("x", (d, i) => labelWidth + i * cellSize + cellSize / 2)
      .attr("y", 38)
      .attr("text-anchor", "end")
      .attr("font-size", "0.99em")
      .attr("fill", "#333")
      .attr(
        "transform",
        (d, i) => `rotate(-34 ${labelWidth + i * cellSize + cellSize / 2},54)`
      )
      .text((d) => d)

    svg
      .append("g")
      .selectAll("text")
      .data(countries)
      .enter()
      .append("text")
      .attr("x", labelWidth - 9)
      .attr("y", (d, i) => 74 + i * cellSize + cellSize / 1.7)
      .attr("text-anchor", "end")
      .attr("font-size", "1.09em")
      .attr("fill", "#242424")
      .text((d) => d)

    svg
      .append("g")
      .selectAll("rect")
      .data(deltaFreedom.flat())
      .enter()
      .append("rect")
      .attr("x", (d, i) => labelWidth + (i % years.length) * cellSize)
      .attr("y", (d, i) => 62 + Math.floor(i / years.length) * cellSize)
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("fill", (d) =>
        d.delta === null ? "#f4f4f4" : colorFreedom(d.delta)
      )

    svg
      .append("text")
      .attr("x", labelWidth + (years.length * cellSize) / 2)
      .attr("y", heatmapHeight + 18)
      .attr("text-anchor", "middle")
      .attr("font-size", "1.12em")
      .attr("font-weight", "bold")
      .text("Variació interanual en desigualtat de gènere")

    svg
      .append("g")
      .selectAll("text")
      .data(years)
      .enter()
      .append("text")
      .attr("x", (d, i) => labelWidth + i * cellSize + cellSize / 2)
      .attr("y", heatmapHeight + 38)
      .attr("text-anchor", "end")
      .attr("font-size", "0.99em")
      .attr("fill", "#333")
      .attr(
        "transform",
        (d, i) =>
          `rotate(-34 ${labelWidth + i * cellSize + cellSize / 2},${
            heatmapHeight + 54
          })`
      )
      .text((d) => d)

    svg
      .append("g")
      .selectAll("text")
      .data(countries)
      .enter()
      .append("text")
      .attr("x", labelWidth - 9)
      .attr("y", (d, i) => heatmapHeight + 74 + i * cellSize + cellSize / 1.7)
      .attr("text-anchor", "end")
      .attr("font-size", "1.09em")
      .attr("fill", "#242424")
      .text((d) => d)

    svg
      .append("g")
      .selectAll("rect")
      .data(deltaGender.flat())
      .enter()
      .append("rect")
      .attr("x", (d, i) => labelWidth + (i % years.length) * cellSize)
      .attr(
        "y",
        (d, i) => heatmapHeight + 62 + Math.floor(i / years.length) * cellSize
      )
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("fill", (d) =>
        d.delta === null ? "#f4f4f4" : colorGender(d.delta)
      )
  }
}
