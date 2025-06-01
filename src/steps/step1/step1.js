import * as d3 from "d3"
import { drawRadarChart } from "../../utils/radarChart.js"

const RADAR_VARIABLES = [
  {
    key: "Property Rights",
    short: "PR",
    desc: "Drets de propietat: protecció legal de la propietat privada, compliment de contractes i seguretat jurídica.",
  },
  {
    key: "Government Integrity",
    short: "GI",
    desc: "Integritat del govern: absència de corrupció, transparència, i bon funcionament de les institucions públiques.",
  },
  {
    key: "Judicial Effectiveness",
    short: "JE",
    desc: "Eficàcia judicial: independència dels tribunals, rapidesa i qualitat en la resolució de conflictes legals.",
  },
  {
    key: "Tax Burden",
    short: "TB",
    desc: "Pressió fiscal: nivell de càrrega tributària sobre empreses i ciutadans.",
  },
  {
    key: "Government Spending",
    short: "GS",
    desc: "Despesa pública: volum i eficiència del gasto governamental en relació amb el PIB.",
  },
  {
    key: "Fiscal Health",
    short: "FH",
    desc: "Salut fiscal: estabilitat pressupostària, dèficit públic i sostenibilitat del deute.",
  },
  {
    key: "Business Freedom",
    short: "BF",
    desc: "Llibertat de negoci: facilitat per crear, operar i tancar empreses sense traves administratives.",
  },
  {
    key: "Labor Freedom",
    short: "LF",
    desc: "Llibertat laboral: flexibilitat del mercat de treball, regulació de contractes i mobilitat.",
  },
  {
    key: "Monetary Freedom",
    short: "MF",
    desc: "Llibertat monetària: estabilitat de preus i absència de controls de preus per part del govern.",
  },
  {
    key: "Trade Freedom",
    short: "TF",
    desc: "Llibertat comercial: absència d’aranzels, quotes o barreres al comerç internacional.",
  },
  {
    key: "Investment Freedom",
    short: "IF",
    desc: "Llibertat d’inversió: facilitat per a inversió nacional i estrangera sense restriccions.",
  },
  {
    key: "Financial Freedom",
    short: "FF",
    desc: "Llibertat financera: independència i desenvolupament del sector bancari i financer.",
  },
]

function getAvailableYears(rows) {
  return Array.from(new Set(rows.map((d) => +d.Year))).sort((a, b) => b - a)
}

export function drawStep1(container, dataset) {
  const allCountries = Array.from(new Set(dataset.map((d) => d.Country))).sort()
  const graphicContainer = container.select(".step-graphic-container")
  const narrativeContainer = container.select(".step-narrative-container")
  graphicContainer.selectAll("*").remove()
  narrativeContainer.selectAll("*").remove()

  let selectedCountry = "Spain"
  let availableRows = dataset.filter((d) => d.Country === selectedCountry)
  let availableYears = getAvailableYears(availableRows)
  let selectedYear = availableYears[0]

  const selectorsDiv = narrativeContainer
    .append("div")
    .attr("class", "selectors-row")
  selectorsDiv.append("label").text("País: ")
  const countrySelect = selectorsDiv.append("select")
  countrySelect
    .selectAll("option")
    .data(allCountries)
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .property("selected", (d) => d === selectedCountry)
    .text((d) => d)

  selectorsDiv.append("label").style("margin-left", "15px").text("Any: ")
  const yearSelect = selectorsDiv.append("select")
  yearSelect
    .selectAll("option")
    .data(availableYears)
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .property("selected", (d) => d === selectedYear)
    .text((d) => d)

  narrativeContainer.append("h2").text("Perfil de llibertat econòmica")
  narrativeContainer
    .append("p")
    .style("margin-bottom", "12px")
    .text(
      "Selecciona un país i un any per veure el perfil de llibertat econòmica segons les 12 dimensions del Economic Freedom Index."
    )

  const insightDiv = narrativeContainer
    .append("div")
    .attr("id", "step1-insight")

  function updateRadar() {
    availableRows = dataset.filter((d) => d.Country === selectedCountry)
    availableYears = getAvailableYears(availableRows)
    if (!availableYears.includes(+selectedYear))
      selectedYear = availableYears[0]
    yearSelect
      .selectAll("option")
      .data(availableYears)
      .join("option")
      .attr("value", (d) => d)
      .property("selected", (d) => d === selectedYear)
      .text((d) => d)
    const entry = availableRows.find((d) => +d.Year === +selectedYear)
    if (!entry) return
    const radarData = RADAR_VARIABLES.map((v) => ({
      axis: v.short,
      value: entry[v.key] && entry[v.key] !== "N/A" ? +entry[v.key] : 0,
    }))
    graphicContainer.selectAll("*").remove()
    drawRadarChart(graphicContainer, radarData, {
      maxValue: 100,
      label: `${selectedCountry} ${selectedYear}`,
    })
    insightDiv.html(
      `<em>Dades corresponents a l'any ${selectedYear}.<br>
      Observa com la distribució de les dimensions mostra punts forts i dèbils de la llibertat econòmica del país seleccionat.</em>`
    )
    narrativeContainer.select(".radar-legend")?.remove()
    const legendHtml = RADAR_VARIABLES.map(
      (v) => `
    <span class="legend-tooltip" data-tooltip="${v.desc || v.key}">
      <b>${v.short}</b>
    </span> ${v.key}
  `
    ).join("<br>")
    narrativeContainer
      .append("div")
      .attr("class", "radar-legend")
      .style("margin-top", "18px")
      .style("font-size", "0.98em")
      .html(`<b>Llegenda:</b><br>${legendHtml}`)
  }

  countrySelect.on("change", function () {
    selectedCountry = this.value
    availableRows = dataset.filter((d) => d.Country === selectedCountry)
    availableYears = getAvailableYears(availableRows)
    selectedYear = availableYears[0]
    updateRadar()
  })

  yearSelect.on("change", function () {
    selectedYear = +this.value
    updateRadar()
  })

  updateRadar()
}
