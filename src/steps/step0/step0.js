export function drawStep0(container) {
  const titleContainer = container.select(".step-title-container")
  const narrativeContainer = container.select(".step-narrative-container")
  titleContainer.selectAll("*").remove()
  narrativeContainer.selectAll("*").remove()

  titleContainer
    .append("h1")
    .attr("class", "step0-title")
    .text("Llibertat Econòmica i Desigualtat de Gènere")

  narrativeContainer
    .append("p")
    .attr("class", "step0-intro")
    .text(
      "Benvingut/da! Aquesta visualització explora de manera interactiva les relacions entre la llibertat econòmica i la desigualtat de gènere a escala mundial."
    )
  narrativeContainer
    .append("p")
    .text(
      "A través de diferents gràfics, podràs comparar països, veure tendències al llarg del temps i identificar patrons o excepcions interessants."
    )
  narrativeContainer
    .append("ul")
    .style("margin-top", "14px")
    .style("margin-bottom", "18px").html(`
      <li>Quina relació hi ha entre la llibertat econòmica i la igualtat de gènere?</li>
      <li>Els països amb més llibertat són també els més igualitaris?</li>
      <li>Quins països són una excepció?</li>
      <li>Com ha evolucionat aquest equilibri les últimes dècades?</li>
    `)
  narrativeContainer
    .append("p")
    .html(
      "<b>Comença a navegar</b> utilitzant les fletxes i descobreix què ens expliquen les dades!"
    )
}
