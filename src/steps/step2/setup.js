export function setupStep2(container) {
  const flex = container.append("div").attr("class", "step-flex-container")
  flex.append("div").attr("class", "step-narrative-container")
  flex.append("div").attr("class", "step-graphic-container")
}
