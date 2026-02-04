// Agent Username Generator
// Generates unique, memorable usernames for AI agents

const PREFIXES = [
  "CIPHER", "VECTOR", "PROXY", "NEXUS", "AXIOM", "DELTA", "SIGMA", "OMEGA",
  "ZENITH", "VERTEX", "MATRIX", "SYNTH", "PHANTOM", "SPECTRE", "ORACLE",
  "SENTINEL", "AEGIS", "NOVA", "PULSE", "FLUX", "HELIX", "PRISM", "ECHO",
  "ATLAS", "TITAN", "GHOST", "SHADE", "VOID", "CORE", "NODE", "GRID"
]

const SUFFIXES = [
  "X7", "V2", "Z9", "K1", "M3", "R8", "Q5", "N6", "P4", "S1",
  "PRIME", "ZERO", "ONE", "MAX", "PRO", "ULTRA", "APEX", "CORE",
  "9K", "7X", "5V", "3Z", "2A", "1S", "8N", "4Q", "6R", "0M"
]

const AGENT_TYPES: Record<string, string[]> = {
  claude: ["CLAUDE", "SONNET", "OPUS", "HAIKU"],
  gpt: ["GPT", "DAVINCI", "TURBO", "OMNI"],
  gemini: ["GEMINI", "BARD", "PALM", "VERTEX"],
  general: ["AGENT", "BOT", "AI", "SYNTH"]
}

// Generate a deterministic username from a seed (like agent ID or timestamp)
export function generateAgentUsername(seed?: string, agentType?: string): string {
  const hash = seed ? simpleHash(seed) : Math.floor(Math.random() * 1000000)
  
  const prefixIndex = hash % PREFIXES.length
  const suffixIndex = (hash >> 8) % SUFFIXES.length
  
  const prefix = PREFIXES[prefixIndex]
  const suffix = SUFFIXES[suffixIndex]
  
  return `${prefix}_${suffix}`
}

// Generate a branded agent username (includes provider name)
export function generateBrandedUsername(agentType: "claude" | "gpt" | "gemini" | string): string {
  const types = AGENT_TYPES[agentType] || AGENT_TYPES.general
  const typeIndex = Math.floor(Math.random() * types.length)
  const suffixIndex = Math.floor(Math.random() * SUFFIXES.length)
  
  return `${types[typeIndex]}_${SUFFIXES[suffixIndex]}`
}

// Simple hash function for deterministic generation
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

// Format agent display name with optional model info
export function formatAgentDisplayName(
  username: string,
  model?: string,
  includeModel = false
): string {
  if (includeModel && model) {
    return `${username} [${model}]`
  }
  return username
}

// Get a consistent color for an agent based on their username
export function getAgentColor(username: string): string {
  const hash = simpleHash(username)
  const colors = [
    "from-cyan-400 to-blue-500",
    "from-purple-400 to-pink-500", 
    "from-green-400 to-emerald-500",
    "from-orange-400 to-red-500",
    "from-yellow-400 to-orange-500",
    "from-pink-400 to-purple-500",
    "from-blue-400 to-indigo-500",
    "from-teal-400 to-cyan-500",
  ]
  return colors[hash % colors.length]
}
