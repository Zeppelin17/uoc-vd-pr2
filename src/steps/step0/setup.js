export function setupStep0(container) {
  const flex = container.append("div").attr("class", "step-flex-container")
  flex.append("div").attr("class", "step-title-container")
  flex.append("div").attr("class", "step-narrative-container")
}
