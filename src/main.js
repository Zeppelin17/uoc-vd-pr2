import * as d3 from "d3"
import { setupStep0 } from "./steps/step0/setup.js"
import { drawStep0 } from "./steps/step0/step0.js"
import { setupStep1 } from "./steps/step1/setup.js"
import { drawStep1 } from "./steps/step1/step1.js"
import { setupStep2 } from "./steps/step2/setup.js"
import { drawStep2 } from "./steps/step2/step2.js"
import { setupStep3 } from "./steps/step3/setup.js"
import { drawStep3 } from "./steps/step3/step3.js"
import { setupStep4 } from "./steps/step4/setup.js"
import { drawStep4 } from "./steps/step4/step4.js"
import { setupStep5 } from "./steps/step5/setup.js"
import { drawStep5 } from "./steps/step5/step5.js"

const steps = [
  { setup: setupStep0, draw: drawStep0 },
  { setup: setupStep1, draw: drawStep1 },
  { setup: setupStep2, draw: drawStep2 },
  { setup: setupStep3, draw: drawStep3 },
  { setup: setupStep4, draw: drawStep4 },
  { setup: setupStep5, draw: drawStep5 },
]

let currentStep = 0
let dataset = []

async function loadData() {
  dataset = await d3.csv("data/dataset.csv", d3.autoType)
}

function renderStep(stepIndex) {
  const container = d3.select("#step-container")
  container.classed("fading", true)
  setTimeout(() => {
    container.selectAll("*").remove()
    const step = steps[stepIndex]
    step.setup(container)
    step.draw(container, dataset)
    container.classed("fading", false)
  }, 440)
}

function updateNavigationButtons() {
  d3.select("#prevBtn").attr("disabled", currentStep === 0 ? true : null)
  d3.select("#nextBtn").attr(
    "disabled",
    currentStep === steps.length - 1 ? true : null
  )
}

d3.select("#prevBtn").on("click", () => {
  if (currentStep > 0) {
    currentStep--
    renderStep(currentStep)
    updateNavigationButtons()
  }
})

d3.select("#nextBtn").on("click", () => {
  if (currentStep < steps.length - 1) {
    currentStep++
    renderStep(currentStep)
    updateNavigationButtons()
  }
})

loadData().then(() => {
  renderStep(currentStep)
  updateNavigationButtons()
})
