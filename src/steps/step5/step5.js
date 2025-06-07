export function drawStep5(container) {
  const narrative = container.select(".step5-narrative-container")
  narrative.selectAll("*").remove()

  narrative
    .append("h2")
    .text(
      "Conclusions: Què ens diuen les dades sobre llibertat econòmica i desigualtat de gènere?"
    )

  const cards = [
    {
      emoji: "🔗",
      title: "Hi ha correlació global?",
      text: "Les dades mostren una correlació general entre més llibertat econòmica i menys desigualtat de gènere, tot i que la força d'aquesta relació varia molt segons el país i el període. Alguns països són clars outliers.",
    },
    {
      emoji: "🏢",
      title: "Llibertat empresarial i drets de propietat: garantia d'igualtat?",
      text: "Els països amb millors puntuacions en llibertat empresarial i drets de propietat solen tenir menys desigualtat, però existeixen excepcions rellevants, especialment en països emergents.",
    },
    {
      emoji: "🌍",
      title: "Evolució per regions",
      text: "Europa i Oceania mostren millores paral·leles en llibertat econòmica i igualtat. Àsia i Amèrica Llatina presenten més divergències: alguns països milloren en llibertat però empitjoren en igualtat o viceversa.",
    },
    {
      emoji: "⚖️",
      title: "Països amb llibertat alta i desigualtat persistent",
      text: "Hi ha casos destacats de països amb índexs elevats de llibertat econòmica però desigualtat de gènere persistent. Això apunta a factors socials, culturals o institucionals més enllà de l'economia.",
    },
    {
      emoji: "⏳",
      title: "Evolució temporal i estabilitat",
      text: "L'evolució de la relació entre els dos indicadors no és lineal: alguns països progressen ràpid, d'altres pateixen retrocessos puntuals. Els països més lliures econòmicament no sempre són els més estables.",
    },
    {
      emoji: "💸",
      title: "L'estat mínim: mite o realitat?",
      text: "No s'observa una relació directa entre baixa despesa pública i màxima llibertat econòmica. De fet, molts països amb despesa elevada mantenen una llibertat econòmica notable.",
    },
  ]

  const cardsDiv = narrative
    .append("div")
    .attr("class", "step5-cards-container")
    .style("display", "flex")
    .style("flex-wrap", "wrap")
    .style("gap", "18px")
    .style("margin-top", "22px")

  cards.forEach((card) => {
    const c = cardsDiv
      .append("div")
      .attr("class", "step5-card")
      .style("flex", "1 1 270px")
      .style("min-width", "220px")
      .style("background", "#f8fafd")
      .style("border-radius", "14px")
      .style("box-shadow", "0 2px 18px rgba(160,170,200,0.06)")
      .style("padding", "22px 20px 18px 20px")
      .style("display", "flex")
      .style("flex-direction", "column")
      .style("align-items", "flex-start")

    c.append("div")
      .style("font-size", "2.1em")
      .style("margin-bottom", "10px")
      .text(card.emoji)
    c.append("div")
      .style("font-size", "1.07em")
      .style("font-weight", "bold")
      .style("margin-bottom", "7px")
      .text(card.title)
    c.append("div")
      .style("font-size", "1em")
      .style("color", "#2b2d38")
      .text(card.text)
  })

  narrative
    .append("div")
    .style("margin-top", "24px")
    .style("font-size", "1.07em")
    .style("color", "#204072")
    .style("background", "#f7f8fa")
    .style("padding", "18px 14px 12px 18px")
    .style("border-radius", "8px")
    .style("border-left", "4px solid #3a72e4")
    .text(
      "En resum: les dades confirmen que la llibertat econòmica i la igualtat de gènere solen caminar juntes, però la realitat és polièdrica. Factors culturals, polítics i socials també hi juguen un paper clau."
    )
}
