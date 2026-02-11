/**
 * Negeri Name Normalization Utility
 * Handles all variations of Malaysian state names
 */

const negeriNormalizationMap = {
  // Kuala Lumpur variations
  'Kuala Lumpur': [
    'kuala lumpur', 'k.l.', 'k.l', 'kl', 'wp kl', 'wpkualalumpur', 'wp kuala lumpur',
    'wilayah persekutuan kuala lumpur', 'wilayah persekutuan kl', 'w.p. kuala lumpur',
    'w.p kuala lumpur', 'w.p.kuala lumpur', 'w p kuala lumpur', 'wpkuala lumpur',
    'wlkuala lumpur', 'w.l. kuala lumpur', 'wilaya persekutuan kuala lumpur',
    'wilayah persekutuan k.l', 'wp k.l', 'w.p.k.l', 'kuala lumpur wp', 'kl wp'
  ],
  
  // Labuan variations
  'Labuan': [
    'labuan', 'wp labuan', 'w.p. labuan', 'w.p labuan', 'wplabuan', 'wilayah persekutuan labuan',
    'wilaya persekutuan labuan', 'w.p.labuan', 'w p labuan', 'wllabuan', 'w.l. labuan',
    'wp labuan', 'labuan wp', 'labuan w.p.', 'labuan wilayah persekutuan'
  ],
  
  // Putrajaya variations
  'Putrajaya': [
    'putrajaya', 'wp putrajaya', 'w.p. putrajaya', 'w.p putrajaya', 'wpputrajaya',
    'wilayah persekutuan putrajaya', 'wilaya persekutuan putrajaya', 'w.p.putrajaya',
    'w p putrajaya', 'wlputrajaya', 'w.l. putrajaya', 'wp putrajaya', 'putrajaya wp',
    'putrajaya w.p.', 'putrajaya wilayah persekutuan'
  ],
  
  // Pulau Pinang variations
  'Pulau Pinang': [
    'pulau pinang', 'penang', 'p.pinang', 'p. pinang', 'pp', 'pulau pinang', 'pulau pinang',
    'p pinang', 'pinang', 'pulau pinang', 'penang island', 'pinang island'
  ],
  
  // Negeri Sembilan variations
  'Negeri Sembilan': [
    'negeri sembilan', 'n.sembilan', 'n. sembilan', 'n sembilan', 'ns', 'negeri 9',
    'negeri sembilan', 'negeri sembilan', 'negeri sembilan', 'sembilan', 'n9'
  ],
  
  // Standard states (minimal variations)
  'Johor': ['johor', 'johore', 'johor darul takzim', 'jdt'],
  'Kedah': ['kedah', 'kedah darul aman'],
  'Kelantan': ['kelantan', 'kelantan darul naim'],
  'Melaka': ['melaka', 'malacca', 'malaka', 'melaka', 'melaka'],
  'Pahang': ['pahang', 'pahang darul makmur'],
  'Perak': ['perak', 'perak darul ridzuan'],
  'Perlis': ['perlis', 'perlis indah kayangan'],
  'Sabah': ['sabah', 'negeri di bawah bayu', 'north borneo'],
  'Sarawak': ['sarawak', 'bumi kenyalang', 'land of the hornbills'],
  'Selangor': ['selangor', 'selangor darul ehsan'],
  'Terengganu': ['terengganu', 'trengganu', 'terengganu darul iman']
};

/**
 * Normalize a negeri name to standard format
 * @param {string} negeriName - Raw negeri name from Excel
 * @returns {string} - Normalized negeri name
 */
function normalizeNegeri(negeriName) {
  if (!negeriName || typeof negeriName !== 'string') {
    return '';
  }
  
  const normalized = negeriName.toString().trim();
  const lowerNormalized = normalized.toLowerCase().replace(/[\s\.]+/g, ' ').trim();
  
  // Check each standard state against all variations
  for (const [standardName, variations] of Object.entries(negeriNormalizationMap)) {
    // Check if input matches any variation
    const normalizedVariations = variations.map(v => 
      v.toLowerCase().replace(/[\s\.]+/g, ' ').trim()
    );
    
    if (normalizedVariations.includes(lowerNormalized)) {
      return standardName;
    }
    
    // Also check if input contains any variation as substring
    for (const variation of normalizedVariations) {
      if (lowerNormalized.includes(variation) || variation.includes(lowerNormalized)) {
        // Additional check: avoid false positives (e.g., "Kuala" matching "Kuala Lumpur")
        if (variation.length > 3 || lowerNormalized === variation) {
          return standardName;
        }
      }
    }
  }
  
  // If no match found, apply general formatting rules
  // Capitalize first letter of each word
  return normalized
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase())
    .replace(/\bWp\b/g, 'WP')
    .replace(/\bW\.p\b/g, 'W.P.')
    .trim();
}

/**
 * Get list of all normalized state names
 * @returns {string[]} - Array of standard state names
 */
function getStandardStates() {
  return Object.keys(negeriNormalizationMap);
}

/**
 * Check if a negeri name is valid (matches or can be normalized)
 * @param {string} negeriName - Negeri name to check
 * @returns {boolean} - True if valid
 */
function isValidNegeri(negeriName) {
  if (!negeriName) return false;
  const normalized = normalizeNegeri(negeriName);
  return getStandardStates().includes(normalized);
}

/**
 * Get statistics about negeri normalization
 * @param {string[]} negeriNames - Array of raw negeri names
 * @returns {Object} - Statistics object
 */
function getNegeriNormalizationStats(negeriNames) {
  const stats = {
    total: negeriNames.length,
    normalized: 0,
    unrecognized: 0,
    breakdown: {}
  };
  
  negeriNames.forEach(name => {
    const normalized = normalizeNegeri(name);
    if (getStandardStates().includes(normalized)) {
      stats.normalized++;
      stats.breakdown[normalized] = (stats.breakdown[normalized] || 0) + 1;
    } else {
      stats.unrecognized++;
      stats.breakdown['UNRECOGNIZED: ' + name] = (stats.breakdown['UNRECOGNIZED: ' + name] || 0) + 1;
    }
  });
  
  return stats;
}

module.exports = {
  normalizeNegeri,
  getStandardStates,
  isValidNegeri,
  getNegeriNormalizationStats,
  negeriNormalizationMap
};