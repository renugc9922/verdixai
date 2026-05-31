import { BarChart3, Bot, FileImage, Leaf, ShieldCheck, Sparkles } from 'lucide-react'

export const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const features = [
  {
    icon: Leaf,
    title: 'Crop Disease Detection',
    description: 'Instantly detect diseases from crop leaf images with AI-powered analysis and confidence scores.',
  },
  {
    icon: Sparkles,
    title: 'AI Recommendations',
    description: 'Get treatment and prevention steps tailored to the detected disease, severity, and crop type.',
  },
  {
    icon: ShieldCheck,
    title: 'Field Ready Insights',
    description: 'Built for fast, practical decision-making with premium dashboards and crop health summaries.',
  },
  {
    icon: Bot,
    title: 'AI Assistant',
    description: 'Ask follow-up questions and get contextual advice from the crop health assistant workflow.',
  },
]

export const loadingTexts = ['Analyzing Crop Patterns...', 'Running AI Detection...', 'Generating AI Report...']

export const supportedDemoFilenames = [
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

export const demoCropOptions = [
  { value: '', label: 'Auto detect' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'tomato', label: 'Tomato' },
  { value: 'potato', label: 'Potato' },
  { value: 'mango', label: 'Mango' },
  { value: 'rice', label: 'Rice' },
  { value: 'cotton', label: 'Cotton' },
  { value: 'corn', label: 'Corn' },
  { value: 'grape', label: 'Grape' },
  { value: 'apple', label: 'Apple' },
]

const demoCropLabelMap = Object.fromEntries(demoCropOptions.filter((item) => item.value).map((item) => [item.value, item.label]))

export const unknownAnalysisResult = {
  crop: 'Unknown',
  disease: 'Unable to identify clearly',
  confidence: 25,
  severity: 'Unknown',
  symptoms: 'Insufficient visual evidence.',
  causes: 'Unable to determine.',
  treatment: 'Please upload a clearer image.',
  prevention: 'Capture the leaf in proper lighting.',
}

export function inferDemoCropKeyFromFileName(fileName = '') {
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

  return ''
}

export function getDemoCropLabel(cropKey) {
  return demoCropLabelMap[cropKey] || 'Unknown crop'
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function formatDateTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function deriveCropType(fileName) {
  const cropKey = inferDemoCropKeyFromFileName(fileName)

  if (cropKey) {
    return getDemoCropLabel(cropKey)
  }

  if (String(fileName).toLowerCase().includes('leaf') || String(fileName).toLowerCase().includes('plant')) return 'Uploaded Crop'
  if (String(fileName).toLowerCase().includes('image') || String(fileName).toLowerCase().includes('scan')) return 'Uploaded Crop'
  return 'Unknown crop'
}

export function getSeverityTone(severity) {
  switch (severity) {
    case 'High':
      return 'text-amber-300 bg-amber-400/10 border-amber-300/15'
    case 'Medium':
      return 'text-sky-300 bg-sky-400/10 border-sky-300/15'
    case 'Unknown':
      return 'text-zinc-300 bg-zinc-400/10 border-zinc-300/15'
    case 'Low':
    default:
      return 'text-emerald-300 bg-emerald-400/10 border-emerald-300/15'
  }
}

export const dashboardStats = [
  { label: 'Total Scans', value: '1,284', change: '+12.4%', icon: BarChart3 },
  { label: 'Healthy Crops', value: '872', change: '68%', icon: Leaf },
  { label: 'Diseases Detected', value: '164', change: '-4.8%', icon: FileImage },
  { label: 'Avg Confidence', value: '96.2%', change: '+1.1%', icon: ShieldCheck },
]

export const dashboardDetections = [
  {
    crop: 'Maize Field #27',
    disease: 'Early Leaf Blight',
    confidence: '96%',
    date: 'May 20, 2026',
    severity: 'High',
  },
  {
    crop: 'Strawberry Greenhouse #04',
    disease: 'Healthy Growth',
    confidence: '99%',
    date: 'May 19, 2026',
    severity: 'Low',
  },
  {
    crop: 'Wheat Plot #12',
    disease: 'Powdery Mildew',
    confidence: '92%',
    date: 'May 18, 2026',
    severity: 'Medium',
  },
]

export const assistantPromptChips = [
  'Best treatment for early fungal stress?',
  'How can I prevent recurring leaf blight?',
  'What is the safest follow-up spray plan?',
]

export const assistantResponses = [
  {
    role: 'user',
    message: 'The result says High severity. What should I do first?',
  },
  {
    role: 'assistant',
    message: 'Start by removing infected leaves and isolating the affected plant rows. Then apply a copper-based fungicide and avoid watering the foliage directly.',
  },
  {
    role: 'assistant',
    message: 'If the spread is rapid, inspect nearby plants daily for new lesions and improve spacing for airflow immediately.',
  },
]
