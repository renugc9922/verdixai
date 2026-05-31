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

module.exports = {
  matchDemoDiseaseKey,
}