const supportedDemoCropKeys = new Set(['strawberry', 'tomato', 'potato', 'mango', 'rice', 'cotton', 'corn', 'grape', 'apple'])

function matchDemoDiseaseKey(fileName = '') {
  const normalizedName = String(fileName).toLowerCase()

  if (normalizedName.includes('strawberry')) return 'strawberry'
  if (normalizedName.includes('tomato')) return 'tomato'
  if (normalizedName.includes('potato')) return 'potato'
  if (normalizedName.includes('mango')) return 'mango'
  if (normalizedName.includes('rice')) return 'rice'
  if (normalizedName.includes('cotton')) return 'cotton'
  if (normalizedName.includes('corn') || normalizedName.includes('maize')) return 'corn'
  if (normalizedName.includes('grape')) return 'grape'
  if (normalizedName.includes('apple')) return 'apple'

  return 'unknown'
}

function resolveDemoDiseaseKey(fileName = '') {
  return matchDemoDiseaseKey(fileName)
}

function isSupportedDemoCropKey(cropKey = '') {
  return supportedDemoCropKeys.has(String(cropKey).toLowerCase())
}

function getSupportedDemoFilenames() {
  return [
    'strawberry_leaf_spot.jpg',
    'tomato_late_blight.jpg',
    'potato_early_blight.jpg',
    'mango_anthracnose.jpg',
    'rice_leaf_blast.jpg',
    'cotton_leaf_curl.jpg',
    'corn_rust.jpg',
    'grape_black_rot.jpg',
    'apple_scab.jpg',
  ]
}

module.exports = {
  matchDemoDiseaseKey,
  resolveDemoDiseaseKey,
  isSupportedDemoCropKey,
  getSupportedDemoFilenames,
}