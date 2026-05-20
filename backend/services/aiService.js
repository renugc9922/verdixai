async function getSampleAnalysis() {
  return {
    diseaseName: 'Tomato Late Blight',
    confidence: 94,
    severity: 'High',
    cropType: 'Tomato',
    symptoms: ['Brown lesions', 'Yellowing leaves', 'Dark patches'],
    causes: 'Fungal-like pathogen caused by high humidity and wet leaves.',
    treatment: 'Remove infected leaves, apply copper-based fungicide, and improve air circulation.',
    prevention: 'Avoid overhead watering, maintain spacing, and inspect plants regularly.',
  }
}

module.exports = {
  getSampleAnalysis,
}
